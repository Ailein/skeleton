$(document).ready(function() {

  // Place JavaScript code here...

  // Set active (selected) navigation elements
  // $('.nav [href="'+ window.location.pathname +'"]').closest('li').toggleClass('active');

  // To handle facebook URL junk
  // http://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url
  if (window.location.hash && window.location.hash == '#_=_') {
      if (window.history && history.pushState) {
          window.history.pushState("", document.title, window.location.pathname);
      } else {
          // Prevent scrolling by storing the page's current scroll offset
          var scroll = {
              top: documentElement.scrollTop,
              left: documentElement.scrollLeft
          };
          window.location.hash = '';
          // Restore the scroll offset, should be flicker free
          documentElement.scrollTop = scroll.top;
          documentElement.scrollLeft = scroll.left;
      }
  }
});
