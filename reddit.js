/*eslint-env browser*/
/*
Preview tab 
after - a bookmark we can use in the following request to get the next request - get the next 25 posts 
before - null 
children - actual posts (25 of them)
dist - number of posts being sent back to us (default- 25) 0 can be changed with limit 
count - how many items have been viewed in the current listing to know when to provide after/before options 
show - optional 
*/
const posts_per_req = 25; // number of memes 
const max_post_to_fetch = 500; // might take time the higher they are 
const max_req = posts_per_req/max_post_to_fetch; // number of requests 

const responses = [];
const imgur_urls = [];
var test_url = '';
// get user's input 
const subreddit_handler = e => {
    e.preventDefault();
    const subreddit = document.getElementById('sub_reddit').value; 
    get_post(subreddit); // async function to fetch posts 
};

// async to send url and await response 
const get_post = async (subreddit, after) => {
    try {
        // reset page 
        document.getElementById('hot_memes').innerHTML = '';
        // filter the hot memes 
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${posts_per_req}${after ? '&after=' + after : ''}`); 
        const JSON_resp = await response.json(); 
        responses.push(JSON_resp);
    
        // do we wan't to fetch anymore ? 
        if(JSON_resp.data.after && responses.length < max_req) {
            get_post(subreddit, JSON_resp.data.after);
        } 
    }catch(err) {
        no_sub_err(); // error display
        return; 
    }
    
    get_results(); 
};

// get parsed json and read specific values 
const get_results = () => {
    const all_posts = [];     
    // loop through responses array and get all the posts 
    responses.forEach(response => {
        // spread operator [...], don't want array of arrays: flat array 
        all_posts.push(...response.data.children);  
    });
    
    // check if we have image 
    const all_img_posts = [];
    let i = 0; 
    all_posts.forEach(({data: {url}}) => {
        const url_ = `${url}`;
        if(url_.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            all_img_posts.push(responses[0].data.children[i++]); 
        }else  {
            i++; // skip non image
        }
    }) 
    //refresh page on change
    if(responses.length !== 0)
        responses.pop(); 
    // display memes
    show_hot(all_img_posts);
};

// just displaying the images 
const show_hot = all_img_posts => {
    let index = 0; 
    const disp_hot = document.getElementById('hot_memes');
    // if no image - indicate that 
    if(all_img_posts.length == 0) {
        no_imgs();
    }else {
        all_img_posts.forEach(({data: {url, score, title}}) => {
            const image = document.createElement('img');
            image.setAttribute("src", `${url}`);
            image.setAttribute("width", "512");
            image.setAttribute("height", "512");
            image.setAttribute("padding", "30px");
            image.className = "img_class";
            const desc = document.createElement('p');
            index++; 
            desc.innerHTML = `${index} <br> Title: ${title} <br> Upvotes: ${score}`;           
            desc.setAttribute("style", "background-color: #474949");
            desc.className = "desc_class";
            disp_hot.appendChild(desc);
            disp_hot.appendChild(image);
        })
        let i = 0; 
        all_img_posts.forEach(({data: {url}}) => {
            imgur_urls.push(all_img_posts[i++].data.url); 
        }) 
    }
};

const select_meme = e => {        
    e.preventDefault();
    let imgur_meme = document.getElementById('meme_num').value;
    if(imgur_urls.length !== 0) {
        try {
            if(parseInt(imgur_meme) > imgur_urls.length || parseInt(imgur_meme) < 1) {
                invalid_number();
            }
            test_url = imgur_urls[parseInt(imgur_meme)-1];
            document.getElementById('post_').style.display = "inline";   
            
            var imgUrl = test_url;   
$(function () {
        var extractToken = function(hash) {
          var match = hash.match(/access_token=(\w+)/);
          return !!match && match[1];
        };
 
        var $post = $('.post');
        var $msg = $('.hidden');
        console.log($post);
        $post.click(function() {
          localStorage.doUpload = true;
          // localStorage.imageBase64 = $img.attr('src').replace(/.*,/, '');
        });
          
        // First, parse the query string
        var params = {}, queryString = location.hash.substring(1),
            regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(queryString)){  
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        } 

        // And send the token over to the server
        var req = new XMLHttpRequest();
        // consider using POST so query isn't logged
        req.open('GET', 'https://' + window.location.host + '/catchtoken?' + queryString, true);

        req.onreadystatechange = function (e) {
            if (req.readyState == 4){
             if(req.status == 200){
                console.log('Success');
                window.location = params['state'];
            }
            else if(req.status == 400) {
                alert('There was an error processing the token.');
            }
            else {
              alert('something else other than 200 was returned');
            }
        }
        };  
          
        // this is the image 
        
        var token = extractToken(document.location.hash);
        console.log(token);
        if(token && JSON.parse(localStorage.doUpload)) {
          localStorage.doUpload = false;
          $post.hide();
          $msg.show();
 
          $.ajax({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/json'
            },
            data: {
              image: imgUrl,
            },  
            success: function(result) {
                // This is the link from imgur 
                console.log(result.data.link);
                // go back to our window - replace this with the other url 
                window.location = 'https://morrisombiro.github.io/MashUp/';   
            } 
          });
        }
      });
        }catch(err) {
            console.log(err);
            return;
        }
    }else
        no_imgs();
};

// error invalid subreddit
function no_sub_err() {
  var x = document.getElementById("err_text");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// error no images 
function no_imgs() {
  var x = document.getElementById("no_imgs");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

//error invalid number
function invalid_number() {
  var x = document.getElementById("inv_num");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

const sel_meme = document.getElementById('meme_num_form');
sel_meme.addEventListener('submit', select_meme);

const chosen_sub = document.getElementById('sub_form');
chosen_sub.addEventListener('submit', subreddit_handler);
