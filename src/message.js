/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')

// This function is the core of the bot behaviour
const replyMessage = (message) => {
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
    .then(result => {
      /*
      * YOUR OWN CODE
      * Here, you can add your own process.
      * Ex: You can call any external API
      * Or: Update your mongo DB
      * etc...
      */
      if (result.action) {
        console.log('The conversation action is: ', result.action.slug)
      }

      const rep = (content, action) => {
        if (action) {
          if (action.slug === 'catalogue_cuisine') {
            return [
              {
                type: 'text',
                content,
              },
              {
                type: 'card',
                content: {
                  title: 'Catalogue',
                  subtitle: 'Cuisines',
                  imageUrl: 'http://www.cuisines-schmidt.com/images/home/image_fond-bak.jpg',
                  buttons: [
                    {
                      title: 'Download',
                      type: 'web_url',
                      value: 'http://www.cuisines-schmidt.com/catalogues_pdf/cuisine/CUISINE_FR.pdf',
                    },
                  ],
                },
              },
            ]
          } else if (action.slug === 'catalogue_sbd') {
            return [
              {
                type: 'text',
                content,
              },
              {
                type: 'card',
                content: {
                  title: 'Catalogue',
                  subtitle: 'Salles de bain',
                  imageUrl: 'http://www.cuisines-schmidt.com/blog/wp-content/uploads/ARCOS_BAIN_WILD_OAK.jpg',
                  buttons: [
                    {
                      title: 'Download',
                      type: 'web_url',
                      value: 'http://www.cuisines-schmidt.com/catalogues_pdf/sdb/SDB_FR.pdf',
                    },
                  ],
                },
              },
            ]
          } else if (action.slug === 'catalogue_tableschaises') {
            return [
              {
                type: 'text',
                content,
              },
              {
                type: 'card',
                content: {
                  title: 'Catalogue',
                  subtitle: 'Tables et chaises',
                  imageUrl: 'http://www.schmidt-lannion.com/wp-content/uploads/2015/07/Table-Chaise-6.jpg',
                  buttons: [
                    {
                      title: 'Download',
                      type: 'web_url',
                      value: 'http://www.cuisines-schmidt.com/catalogues_pdf/rgt/RGT_FR.pdf',
                    },
                  ],
                },
              },
            ]
          }

          return {
            type: 'text',
            content,
          }
        }

        return {
          type: 'text',
          content,
        }
      }

      // If there is not any message return by Recast.AI for this current conversation
      if (!result.replies.length) {
        message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
      } else {
        // Add each reply received from API to replies stack
        result.replies.forEach(replyContent => message.addReply(rep(replyContent, result.action)))
      }

      // Send all replies
      message.reply()
        .then(() => {
          // Do some code after sending messages
        })
        .catch(err => {
          console.error('Error while sending message to channel', err)
        })
    })
    .catch(err => {
      console.error('Error while sending message to Recast.AI', err)
    })
}

module.exports = replyMessage
