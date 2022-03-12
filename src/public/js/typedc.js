const typed = new Typed('.typedc', {
    strings: [
		'<i>A</i>',
		'<i>sudo rm -rf /*</i>',
        '<i>nano roo</i>',
        '<i>cat root.txt</i>'
    ],

    typeSpeed: 50,
	startDelay: 300, 
	backSpeed: 50, 
	smartBackspace: true, 
	shuffle: false, 
	backDelay: 1500, 
	loop: true, 
	loopCount: false, 
	showCursor: true, 
	cursorChar: '|',
	contentType: 'html',
})