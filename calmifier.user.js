// ==UserScript==
// @name         Devrant Calmifier
// @namespace    https://devrant.com/
// @version      0.1
// @description  Calm down rants, feed, comments and profiles
// @author       7twin
// @match        https://devrant.com/rants/*
// @match        https://devrant.com/feed/
// @match        https://devrant.com/users/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.rawgit.com/nfrasser/linkify-shim/master/linkify.min.js
// @require      https://cdn.rawgit.com/nfrasser/linkify-shim/master/linkify-jquery.min.js
// @require      https://cdn.polyfill.io/v2/polyfill.min.js
// ==/UserScript==

(function() {
    $("h1.rantlist-content,.rantlist-title-text,.username-row+.rantlist-title").each(function(){
        var input = $(this).text();
        var lowercase = input.match(/[a-z]/gm); lowercase = ((lowercase) ? lowercase.length : 0);
        var uppercase = input.match(/[A-Z]/gm); uppercase = ((uppercase) ? uppercase.length : 0);

        // match only more than one occurence of exclamation or question marks
        // match only three or more full stops, because links get shortened with "..."
        var punctuationMarks = input.match(/(([?!])\1+|([.]){3,})/gm);

        // replace multiple occurences with single matched char
        input = input.replace(/([?!])\1+/gm,"$1");
        input = input.replace(/([.]){3,}/gm,"$1");

        // count all occurences in matched groups, to get how many have been replaced
        punctuationMarks = ((punctuationMarks && punctuationMarks.length > 0) ? ($(this).text().match(/([?|!|.])/gm).length - punctuationMarks.length) : 0);
        var total = punctuationMarks+lowercase+uppercase;

        // only trigger if the text contains more uppercase than lowercase
        if(lowercase <= uppercase){
            // replace lowercase and punctuation marks
            $(this).html((input.toLowerCase()+"<br><br><b>[calmed: " + ((uppercase === 0) ? 0 : Math.ceil(((uppercase+punctuationMarks)/total)*100)) + "%]</b>").replace(/\n/g, '<br />'));
        }else if(punctuationMarks > 0){
            // fallback to replacing punctuation marks
            $(this).html((input+"<br><br><b>[calmed: " + Math.ceil((punctuationMarks/total)*100) + "%]</b>").replace(/\n/g, '<br />'));
        }

        // linkify links that got stripped
        $(this).linkify({
            target: "_blank"
        });
    });
})();
