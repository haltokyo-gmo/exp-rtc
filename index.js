(function() {
	navigator.mediaDevices.getUserMedia({video: {
		mandatory: {
			maxWidth: 600,
			maxHeight: 400
		}
	}, audio: false})
	.then(function(stream) {
		var v = document.querySelector('#video');
		v.src = URL.createObjectURL(stream);
		v.play();
	})
	.catch(function(error) {
		console.error(error);
	})

	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');
	ctx.scale(-1, 1);

	function capture() {
		ctx.drawImage(document.querySelector('#video'), -600, 0);
	}

	var countdown = 0;
	function count() {
		document.querySelector('#countdown').textContent = countdown;
		countdown--;
	}

	document.querySelector('#button').addEventListener('click', function() {
		setTimeout(capture, 10000);
		countdown = 10;
		count();
		setInterval(count, 1000);

		// ctx.drawImage(document.querySelector('#video'), -600, 0);
		// canvas.toBlob(function(blob) {
		// 	$.ajax({
		// 		cache: false,
		// 		contentType: 'application/json',
		// 		data: {
		// 			"url": URL.createObjectURL(blob)
		// 		},
		// 		dataType: 'json',
		// 		headers: {
		// 			'Ocp-Apim-Subscription-Key': 'subscription key here'
		// 		},
		// 		method: 'POST',
		// 		processData: false,
		// 		url: 'https://api.projectoxford.ai/emotion/v1.0/recognize'
		// 	})
		// 	.done(function(data) {
		// 		for(var i in data) {
		// 			var rect = data[i].faceRectangle;
		// 			var text = MaxEmotion(data[i].scores);
		//
		// 			ctx.beginPath();
		// 			ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
		// 			ctx.fillStyle = 'black';
		// 			var m = ctx.measureText(text);
		// 			ctx.fillRect(rect.left, rect.top - 10, m.width, 10);
		// 			ctx.fillStyle = 'white';
		// 			ctx.fillText(text, rect.left, rect.top);
		// 		}
		// 	})
		// 	.fail(function(error) {
		// 		console.log(error);
		// 	})
		// }, 'image/jpeg', 0.95);
	})
})();
