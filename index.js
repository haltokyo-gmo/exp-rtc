(function() {
	navigator.mediaDevices.getUserMedia({video: {
		mandatory: {
			maxWidth: 600,
			maxHeight: 400
		}
	}, audio: false})
	.then(function(stream) {
		var v = document.querySelector('#video');
		v.src = window.URL.createObjectURL(stream);
		v.play();
	})
	.catch(function(error) {
		console.error(error);
	})

	var ctx = document.querySelector('#canvas').getContext('2d');
	ctx.scale(-1, 1);

	document.querySelector('#button').addEventListener('click', function() {
		ctx.drawImage(document.querySelector('#video'), -600, 0);
	})
})();
