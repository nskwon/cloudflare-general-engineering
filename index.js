const host = "https://static-links-page.signalnerve.workers.dev"
const hostUrl = host + "/static/html"
const links = [
  { 
    name: "My Website Project: ConfessionLib",
    url: "https://confessionlib.herokuapp.com/"
  },
  {
    name: "An Artist I Like",
    url: "https://www.artstation.com/aenamiart"
  },
  {
    name: "My Favorite Animal",
    url: "https://en.wikipedia.org/wiki/Blue_whale"
  }
]

const socialLinks = [
  {
    url: 'https://www.instagram.com/unbelievablewhale/',
    svg: 'https://simpleicons.org/icons/instagram.svg'
  },
  {
    url: 'https://github.com/nskwon',
    svg: 'https://simpleicons.org/icons/github.svg'
  },
  {
    url: 'https://www.linkedin.com/in/nathan-kwon-67620613b/',
    svg: 'https://simpleicons.org/icons/linkedin.svg'
  }
]

class DivHandler {
  constructor(links,socialLinks,attributeName) {
    this.links = links
    this.socialLinks = socialLinks
    this.attributeName = attributeName
  }
  
  async element(element) {
    var attribute = element.getAttribute('id')
    if (attribute == 'links'){
      for (var i = 0; i < links.length; i++){
        element.append(`<a href=${links[i].url} target="_blank">${links[i].name}</a>`, {html: true})
      }
    }
    else if(attribute == 'profile'){
      element.removeAttribute('style')
    }
    else if(attribute == 'social'){
      element.removeAttribute('style')
      for (var i = 0; i < socialLinks.length; i++){
        element.append(`<a href=${socialLinks[i].url} target="_blank"><img src=${socialLinks[i].svg}></img></a>`, {html: true})
      }
    }
  }
}

class SetAttributeHandler{
  constructor(attribute, value){
    this.attribute = attribute
    this.value = value
  }
  async element(element){
    element.setAttribute(this.attribute,this.value)
  }
}

class SetInnerContentHandler{
  constructor(value){
    this.value = value
  }
  async element(element){
    element.setInnerContent(this.value)
  }
}

const rewriter = new HTMLRewriter()
  .on('div', new DivHandler(links,'id'))
  .on('img#avatar', new SetAttributeHandler('src', 'https://i.ibb.co/d4BMy7z/profile.jpg'))
  .on('h1#name', new SetInnerContentHandler('nskwon'))
  .on('title', new SetInnerContentHandler('Nathan Kwon'))
  .on('body', new SetAttributeHandler('class','bg-blue-500'))

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
  @param {Response} response
*/
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

/**
  @param {Request} request
 */
async function handleRequest(request) {
  if (request.url == 'https://my-project.nskwon.workers.dev/links'){
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'JSON'},
    })
  }
  else{
    const init = {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    }
    const response = await fetch(hostUrl, init)
    const results = await gatherResponse(response)
    res = new Response(results, init)
    return rewriter.transform(res)
  }

}