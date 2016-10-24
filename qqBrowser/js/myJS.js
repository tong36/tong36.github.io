ready(function(){
	var setting = document.querySelector('#bj')
	var p0_content = document.querySelector('.p0_content')
	setTimeout(function(){
		setting.style.transform = 'scale(1) rotateZ(0deg)';
		p0_content.style.transform = 'translateZ(0)'
	},300)
	var Mdiv = document.querySelector('.row4').getElementsByTagName('div') 
	var num = 0
	var onOff = true

	var partTwo = $('#parttwo')
	var twoMove = $('.p1move',partTwo)[0]
	var number = $('.number',partTwo)[0]
	var partOne = $('#p0')
	var circle = $('#circle')
	var circleLi = $('li',circle)
	var cirLen = circleLi.length
	var logo = $('.log-wrap')[0]
	wheelFn( document.body,function(flag){
		
		if(!onOff) return
		onOff = false	

		if( !flag ){ // flag => 取反 下滑	
		
			num++;
			if( num >= cirLen){
				num = 0
			}
			pageFn()
			console.log( num )
			if( num%cirLen == 1 ){
				wheelTwo()
			}
			if( num%cirLen == 2 ){
				wheelThree()
			}
			if( num%cirLen == 3 ){
				wheelFour()
			}
			if( num%cirLen == 0  ){
				wheelOne()
			}
		}else{
			num--
			if( num < 0){
				onOff = true
				num = 0
				return
			}
			console.log(num)
			pageFn()
			if( num == 0 ){
				addClass('addBignum',number)
				removeClass('p1move1',twoMove)
				wheelOne()
			}
			if( num == 1 ){
				removeClass('addp2wrap',partTwoWrap)
				wheelTwo()
			}
			if( num == 2 ){
				removeClass('addText',FourText)
				removeClass( 'addWord',FourWord)
				for (var i = 0; i < FourImgBox.length; i++) {
					removeClass('addp3img',FourImgBox[i])	
				}
				wheelThree()
			}
		}
	})

	var partTwo = $('#p2')
	var partTwoWrap = $('.p2Wrap',partTwo)[0]
	var partTwoText = $('#p2_text')

	function wheelTwo(){
		removeClass( 'clockMove',twoMove )
		removeClass( 'p1move1',twoMove )
		removeClass('addBignum',number)
		removeClass('numberMove',number)
		addClass( 'clockMove',twoMove )
		mTween(logo,'opacity',1,600,'easeOut')
		mTween(partOne,'opacity',0,1500,'easeOut')

		setTimeout(function(){
			addClass('p1move1',twoMove) 
			removeClass('clockMove',twoMove) 
			setting.style.transform = 'scale(1) rotateZ(-60deg)';
		},900)

		setTimeout( function(){
			addClass('numberMove',number)
		},1100)
		timeFn()
	}

	function wheelThree(){
		removeClass('numberMove',number) 
		removeClass('p1move1',twoMove) 
		removeClass('addp2wrap',partTwoWrap)
		addClass('addBignum',number)
		// number.style.transform = 'translateZ(1500px)';
		setTimeout(function(){
			partTwo.style.opacity = 1;
			addClass('addp2wrap',partTwoWrap)
			addClass('addp2text',partTwoText)
			removeClass('addBignum',number) 
			// number.style.opacity = 0
			// removeClass( 'numberMove',number )
		},1000)
		timeFn()
	}

	var partFour = $('#p3')
	var FourImgWrap = $('.p3Aimg',partFour)[0]
	var FourImgBox = $( 'div', FourImgWrap )
	var FourText = $( '.p3Bimg', partFour )[0]
	var FourWord = $( '.p3word', partFour )[0]

	function wheelFour(){
		for (var i = 0; i < FourImgBox.length; i++) {
			addClass('addp3img',FourImgBox[i])	
		}
		addClass( 'addText',FourText)
		addClass( 'addWord',FourWord)
		partTwoWrap.removeAttribute('addp2wrap')
		removeClass('addp2wrap',partTwoWrap)
		// addClass('addp2wrap2',partTwoWrap)
		timeFn()
	}

	function wheelOne(){
		for (var i = 0; i < FourImgBox.length; i++) {
			removeClass('addp3img',FourImgBox[i])	
		}
		removeClass( 'addText',FourText)
		removeClass( 'addWord',FourWord)
		mTween(logo,'opacity',0,500,'easeOut')
		setTimeout(function(){
			setting.style.transform = 'scale(1) rotateZ(0deg)';
			p0_content.style.transform = 'translateZ(0)'
			mTween(partOne,'opacity',1,1500,'easeOut')
		},1100)
		timeFn()
	}

	function timeFn(){
		setTimeout(function(){
			onOff = true
		},2000)
	}

	function pageFn(){
		for (var i = 0; i < circleLi.length; i++) {
			circleLi[i].className = ''
		}
		addClass('active',circleLi[ num%cirLen ])
	}
})