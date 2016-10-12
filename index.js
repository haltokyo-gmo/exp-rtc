(function() {
	navigator.mediaDevices.getUserMedia({video: {
		mandatory: {
			maxWidth: 300,
			maxHeight: 200
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
})();
