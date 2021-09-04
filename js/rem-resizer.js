const REM_RESIZER = {
    observer: new ResizeObserver(entries => {
        entries.forEach( entry => {
            let width = entry.contentRect.width;
            
            if (width > 1080) {
                document.querySelector(':root').style.fontSize = '17.2px';
            } else if (width < 750){
                document.querySelector(':root').style.fontSize = '10px';
            }
            else {
                document.querySelector(':root').style.fontSize = `${width/150 + 10}px`;
                
            }
        
        })
    }),
    

    init: function(){
        this.observer.observe(document.body)
    }
}

REM_RESIZER.init();