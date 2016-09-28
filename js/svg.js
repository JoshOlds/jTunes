window.onload = function () {
  var radius = 3, // set the radius of the circle
      circumference = 2 * radius * Math.PI; 
  
  var els = document.querySelectorAll('circle');
  Array.prototype.forEach.call(els, function (el) {
    el.setAttribute('stroke-dasharray', circumference + 'em');
    el.setAttribute('r', radius + 'em');
  });
  
  document.querySelector('.radial-progress-center').setAttribute('r', (radius - 0.01 + 'em'));
  
  var currentCount = 1, 
      maxCount = 400;
  
  var intervalId = setInterval(function () { 
    if (currentCount > maxCount) {
      clearInterval(intervalId);
      return;
    }
    var offset = -(circumference / maxCount) * currentCount + 'em';
    console.log(currentCount, offset);

    document.querySelector('.radial-progress-cover').setAttribute('stroke-dashoffset', offset);
        
    currentCount++;
  }, 25);
}; 

