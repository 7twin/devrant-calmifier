// ==UserScript==
// @name         Devrant Calmifier
// @namespace    https://devrant.com/
// @version      0.5
// @description  Calm down rants, feed, comments and profiles
// @author       7twin
// @match        https://devrant.com/rants/*
// @match        https://devrant.com/feed*
// @match        https://devrant.com/users/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.polyfill.io/v2/polyfill.min.js
// ==/UserScript==

/* config start */
    var highlight_changes = false;
/* config end */

(function() {
    var linkify_str = function(old,changed){
        const regex = /<a\s+href=(?:"([^"]+)"|'(?:[^']+)').*?>(.*?)<\/a>/g;
        let m;

        while ((m = regex.exec(old)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) regex.lastIndex++;

            changed = changed.replace(m[2],"<a href='"+m[1]+"'>"+m[2]+"</a>");
        }

        return changed;
    };

    $("h1.rantlist-content,.rantlist-title-text,.username-row+.rantlist-title").each(function(){
        var input = $(this).text();
        var lowercase = input.match(/[a-z]/gm); lowercase = ((lowercase) ? lowercase.length : 0);
        var uppercase = input.match(/((\b[A-Z]{1,}\b)(?:\s*)){2,}/gm);

        // match only more than one occurence of exclamation or question marks
        // match only three or more full stops, because links get shortened with "..."
        var punctuationMarks = input.match(/(([?!])\2+|([.]){4,})/gm);

        // replace multiple occurences with single matched char
        input = input.replace(/([?!])\1+/gm,"$1");
        input = input.replace(/([.]){4,}/gm,"$1");

        input = input.replace(/((\b[A-Z]{1,}\b)(?:\s*)){2,}/gm, function(m){
            return ((highlight_changes === true) ? '<span style="color:rgba(255,255,255,0.65)">'+m.toLowerCase()+'</span>' : m.toLowerCase())
        });

        // count all occurences in matched groups, to get how many have been replaced
        punctuationMarks = ((punctuationMarks && punctuationMarks.length > 0) ? punctuationMarks.reduce((total,currentItem) => total+currentItem.length, 0) : 0);
        uppercase = ((uppercase && uppercase.length > 0) ? uppercase.reduce((total,currentItem) => total+currentItem.length, 0) : 0);

        var total = $(this).text().length;
        var changed = uppercase+punctuationMarks;
        var diffPercent = Math.round((changed/total)*100);

        // only trigger if the text contains more uppercase than lowercase
        // also linkify stripped hyperlinks

        if(diffPercent > 0){
           $(this).html((linkify_str($(this).html(),input)+"<br><br><b>[calmed: " + diffPercent + "%]</b>").replace(/\n/g, '<br />'));
        }
    });
})();
