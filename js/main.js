// get current number of items in cart and publish to "cart" nav item
function getCartCount(){
	var newCount = localStorage.getItem("pages");
	if(newCount){
		var newCountArray = JSON.parse(newCount);
		$('#cart-count span').text('('+newCountArray.length+')');
	} else {
		$('#cart-count span').text('(0)');		
	}
}

getCartCount();


if( $('.product-page').length ){
	// get current page url
	var curr_product = window.location.pathname;
	// check if there is a pages array, if not create one
	var pages = localStorage.getItem("pages");
	pages = (pages) ? JSON.parse(pages) : [];
	// check if current page item is in the cart already...
	if( $.inArray( curr_product, pages ) !== -1 ){
		// ... if it is, disable the button
		$('.button')
			.addClass('disabled')
			.after('<p class="disabled-notice">This item is already in your cart.</p>')
			.click(function(e){
				e.preventDefault();
			});
	} else {
		// ... else, allow button to function as expected
		$('.button').click(function(e){
			// prevent default behavior
			e.preventDefault();
			// push current page into pages array
			pages.push(curr_product);
			// update pages variable in local storage
			localStorage.setItem("pages", JSON.stringify(pages));
			var newCount = localStorage.getItem("pages");
			var newCountArray = JSON.parse(newCount);
			$('#cart_count span').text(newCountArray.length);
			// redirect to cart
			window.location.href = '../cart.html';
		});
		
	}

}

if( $('.order').length ){
	var pages = localStorage.getItem("pages");
	// check if there is a pages array
	// it is not likely someone would just go to the order page
	// if they did, and the array was not already set up, there could be bad UX
	// this is more of a safeguard
	if(pages){
		// get the array
		pages = JSON.parse(pages);
		// check if there's anything in it
		if (pages.length > 0){
			// allow submit
			$('#submit').click(function(e){
				e.preventDefault();
				// empty cart
				localStorage.clear();
				// go to confirmation page
				window.location.href = 'confirmation.html';	
			});
		} else {
			// don't allow submit
			$('#submit')
				.addClass('disabled')
				.after('<p>There are no items in your cart.</p>')
				.click(function(e){
					e.preventDefault();
				});
		}
	} else {
		// redundant
		$('#submit')
			.addClass('disabled')
			.after('<p>There are no items in your cart.</p>')
			.click(function(e){
				e.preventDefault();
			});
	}
}

if( $('.cart').length ){

	var pages = localStorage.getItem("pages");
	var cart_total = Number(0);

	// only parse array if there is one
	// avoids errors
	if(pages){
    	var pagesArray = JSON.parse(pages);
	}

	function loadContent(path){
		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		  	// Load content from menu.html
		    var resp = request.responseText;
		    // Create parser to filter loadedcontent
		    var parser = new DOMParser();
		    var htmlDoc = parser.parseFromString(resp,"text/html");
		    // Select the heading from content
		    var prod_heading = htmlDoc.querySelector("main h1").innerHTML;
		    // Select the price from content
		    var prod_price = htmlDoc.querySelector("main h2").innerHTML;
		    // remove the dollar sign from the price
		    var prod_price_num = prod_price.replace(/[$]/,'');
		    // Select the image from content
		    var prod_image = htmlDoc.querySelector("main img").src;
		    // remove path from image file reference
		    var prod_image_name = prod_image.replace(/^.*[\\\/]/, '');
		    // Select the product description from content
		    var prod_desc = htmlDoc.querySelector("main p").innerHTML;
		    // Concat all content into entry markup
		    var prod_listing = '<div class="product-listing panel" data-path="'+path+'"><div class="row"><div class="column medium-3"><img src="img/'+prod_image_name+'"></div><div class="column medium-9"><button class="tiny radius right">Remove</button><h4><a href="'+path+'">'+prod_heading+'</a></h4><h5>$'+prod_price_num+'</h5><p>'+prod_desc+'</p></div></div></div>';
		    // Append entry to main section
		    $('.cart-content').append(prod_listing);
		    // Add up cart total
		    cart_total += Number(prod_price_num);
		    $('#order-total').html('<span class="order-total-label left">Order Total</span><span class="order-total-amount right">$'+cart_total+'</span>');
		  } else {
		    // We reached our target server, but it returned an error
		    alert("Error 1");
		  }
		};
		request.onerror = function() {
		  // There was a connection error of some sort
		  alert("Error 2");
		};
		request.send();
	}

	// loop over array of entries to print content
	if(pages){
	    for ( var i = 0; i<pagesArray.length; i++ ) {
	      loadContent(pagesArray[i]);
	    }
	} else {
	    console.log('No content, sorry.');
	}

	// handle clicks on individual entries (mechanism for deleting entries)
	$('.cart-content').on('click','button',function(){
		// get current item
		var index = $(this).parents('.product-listing').attr('data-path');
		// identify target in array
		var delete_item = pagesArray.indexOf(index);
		// remove item from array
        pagesArray.splice(delete_item,1);
		// update array ("pages") variable in local storage
		localStorage.setItem("pages", JSON.stringify(pagesArray));
	    // refresh cart
		window.location.href = 'cart.html';		
	});

	// if user goes directly to cart, and there's nothing in it
	// there's nothing in the cart to order
	// disable the order button
	if (!pages||pagesArray.length == 0){
		// disable order button
		$('#order-button a')
			.addClass('disabled')
			.after('<p>There are no items in your cart.</p>')
			.click(function(e){
				e.preventDefault();
			});
	}

}

// sample array

var arr = ["\"You've got your passion, you've got your pride, but don't you know that only fools are satisfied?\"</br><span>\"Vienna\" by Billy Joel</span>", 
		   "\"Do you make mistakes or do you make a change? Or do you draw the line for when it's better days?\"</br><span>\"BLEACH\" by BROCKHAMPTON</span>", 
		   "\"I thought it up and brought up the past, once you know you can never go back, I gotta take it on the other side.\"</br><span>\"Otherside\" by Red Hot Chili Peppers</span>", 
		   "\"It took a little while for your mind to find it, but once you see the genius</br>it's intimidating, isn't it?\"</br><span>\"Pre-Occupied\" by Jon Bellion</span>", 
		   "\"Don't forget the happy thoughts. All you need is happy thoughts.\"</br><span>\"Same Drugs\" by Chance The Rapper</span>",
		   "\"So wake me up in the spring, while I'm high off my American dream.\"</br><span>\"American Teen\" by Khalid</span>",
		   "\"If you just give me some time I can open up your mind. If you let it shine, you can free your mind.\"</br><span>\"Sober\" by Childish Gambino</span>",
		   "\"Cause I see the world in different colors to someone like you\"</br><span>\"Settle\" by Two Door Cinema Club</span>",
		   "\"But it's just the price I pay, destiny is calling me. Open up my eager eyes, 'cause I'm Mr. Brightside.\"</br><span>\"Mr. Brightside\" by The Killers</span>",
		   "\"And I come in peace to compete, I don't run if you'd rather leap, my statistics go up in weeks.\"</br><span>\"Rigamortis\" by Kendrick Lamar</span>",
		   "\"But I'm a champion, so I turned tragedy to triumph, make music thats fire, spit my soul through the wire.\"</br><span>\"Through the Wire\" by Kanye West</span>",
		   "\"Something sinister to it. Pendulum swinging slow, a degenerate moving through the city with criminal stealth.\"</br><span>\"Chum\" by Earl Sweatshirt</span>",
		   "\"Hello there, the angel from my nightmare, shadow in the</br>background of the morgue.\"</br><span>\"I Miss You\" by Blink-182</span>",
		   ];
	function getRandomlyric(){
  		// get random number based on length of array
  		var rand = Math.floor(Math.random() * arr.length);
  		// display random value
  		$('.lyric h2').html( arr[rand] );
	}

var num = ['Order Number: 308512033',
		   'Order Number: 840163726',
		   'Order Number: 736392746',
		   'Order Number: 105937624',
		   'Order Number: 817591057',
		   'Order Number: 287563986',
		   'Order Number: 109837562'];
	function getRandomnumber(){
  		// get random number based on length of array
  		var rand = Math.floor(Math.random() * num.length);
  		// display random value
  		$('.order-number').text( num[rand] );
	}

// call function when page loads
getRandomlyric();
getRandomnumber();


// saving arrays to local storage
// https://www.kirupa.com/html5/storing_and_retrieving_an_array_from_local_storage.htm

// details on using arrays with local storage
// https://stackoverflow.com/questions/39811896/localstorage-array

// details on get DOM infor from another page
// https://stackoverflow.com/questions/12899047/how-to-use-javascript-to-access-another-pages-elements

// details on getting just the file name from a path
// https://stackoverflow.com/a/423385
