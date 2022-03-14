const vscode = require("vscode")
const axios = require("axios")
const xmlParser = require("fast-xml-parser")
const https = require("https")

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  https.globalAgent.options.rejectUnauthorized = false
  const res = await axios.get("https://blog.webdevsimplified.com/rss.xml")
  const articles = xmlParser
    .parse(res.data)
    .rss.channel.item.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .map(article => {
      return {
        label: article.title,
        detail: article.description,
        link: article.link,
      }
    })

  let disposable = vscode.commands.registerCommand(
    "wds-blog-search.searchWdsBlog",
    async function () {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      })

      if (article == null) return

      vscode.env.openExternal(article.link)
    }
  )

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
