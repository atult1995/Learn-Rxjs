import { Component, OnInit,AfterViewInit, HostListener } from '@angular/core';
import { Scroll } from '@angular/router';
import { bufferTime, catchError, combineLatest, concat, delay, from, fromEvent, interval, map, mapTo, merge, of, retry, scan, startWith, switchMap, take, takeUntil, tap, timer, zip } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit(): void {
    this.understandSwitchObservable()
    this.understandingTap()
    this.understandingTake()
    this.getCatchError()
    this.getTakeUntil()
    this.understandCombinedLatest()
    this.understandStartWith()
    this.understandScan()
    this.canWeMapButtonClickToNumber()
    this.findHowManyClickForRedAndBlack()
    this.understandZip()
    this.understandMerge()
    this.understandConcat()
    this.understandBufferTime()
  }
  ngAfterViewInit(){
    this.getEventFromMyDiv()
  }
  getUserId(){
    return "1"
  }
  getUserDetails(id:string){
    return "atul"
  }
  understandSwitchObservable(){
   const x= of(this.getUserId()).
    pipe(
      switchMap((id)=>this.getUserDetails(id))
    ).subscribe({
      next:(res)=>{
        console.log(res)
      }
    })
  }
  understandingTap(){
    const x=[1,2,3,4]
    of(x).pipe(
      tap((x)=>console.log("reciver Value",x))
    ).subscribe({
      next:(res)=>{
        console.log("emiited value",res)
      }
    })
  }
  understandingTake(){
    const x=[2,3,4,5]
    from(x).pipe(
      take(1)
    ).subscribe({
      next:(res)=>{
        console.log("understand take",res)
      }
    })

    const temp$=interval(1000)
    temp$.pipe(
      take(2)
    ).subscribe({
      next:(res)=>{
        console.log("count",res)
      }
    })
  }
  getEventFromMyDiv(){
    const id=document.getElementById('myid')!
    const mouseMove=fromEvent<MouseEvent>(id,'mousemove')
    const subsribe=mouseMove.subscribe(evt=>{
      console.log(`coord: ${evt.clientX} X ${evt.clientY} Y`);
      if(evt.clientX<40 && evt.clientY <40){
        subsribe.unsubscribe()
      }
    })
   
  }
  getCatchError(){
    from([1,2,3,4,5,6]).pipe(
      map((res)=>{
        if(res>5){
          throw new Error("jkkkjjk")
        }
        return res
      }),
      catchError((res)=>of([]))
    ).subscribe((res)=>{
      console.log(res)
    })
  }
  retryUpto3Times(){
    from([1,2,3,4,5,6]).pipe(
      map((res)=>{
        if(res>5){
          throw new Error("jkkkjjk")
        }
        return res
      }),
      retry(3),
      catchError((res)=>of([]))
    ).subscribe((res)=>{
      console.log(res)
    })
  }
  getTakeUntil(){
    const intervaltemp=interval(1000)
    const buttonRef=document.getElementById('button')!
    const buttonEvent=fromEvent<MouseEvent>(buttonRef,'click')
    intervaltemp.pipe(
      takeUntil(buttonEvent)
    ).subscribe(res=>{
      console.log("res",res)
    })
  }

  //here we have defined some mouse events, these will target the whole compo, 
  //if you want to target particular element then create directive and shift these 
  //event to that directive
  
  // @HostListener('window:scroll',['$event'])
  // onScroll(event:any){
  //   console.log(event)
  // }
  // @HostListener('window:mouseover',['$event'])
  // onHover(event:any){
  //   console.log("hover",event)
  // }

  understandCombinedLatest(){
    const timer1$=timer(1000,4000)
    const timer2$=timer(2000,4000)
    const timer3$=timer(3000,4000)
   const x= combineLatest([timer1$,timer2$,timer3$]).subscribe((res)=>{
      console.log("res",res)
      if(res[0]===3 && res[1] ===3 && res[2] === 3){
        x.unsubscribe()
      }
    })
  }
  understandStartWith(){
    const source=from(['atul','gaurav'])
    source.pipe(
      startWith('hello','hhhh','kkkkk')
    ).subscribe((res)=>{
      console.log(res)
    })
  }
  understandScan(){
    //same as reduce function of array
    const source=from(['atul','gaurav'])
    source.pipe(
      startWith('hello'),
      scan((acc,cur)=>{
        return `${acc} ${cur}`
      })
    ).subscribe((res)=>{
      console.log(res)
    })
    /*output
    hello
    hello atul
    hello atul gaurav
    */

    //second example
    //add number
    const s=from([1,2,3])
    s.pipe(
      scan((acc,cur)=>acc+cur,1)
    ).subscribe(res=>{
      console.log(res)
    })
    /*output
      (0+1)=1, 1+2=3, 3+3 =6

      so out put is 1,3,6

      here we provided seed=0, so its start from 0+1, if we dont provide then
      it will start from 1, then 1+2=3, then 3+3=6
      1,3,6

      lets seed=2
      then 2, 4, 7
    */
  }

  canWeMapButtonClickToNumber(){
    const button=document.getElementById('button-click')!
    fromEvent(button,'click').pipe(
      mapTo(1),
      scan((acc,cur)=>acc+cur,0)
    ).subscribe((res)=>{
      console.log("click count",res)
    })
  }
  findHowManyClickForRedAndBlack(){
    const blackSpan=document.getElementById('black-count')!
    const redSpan=document.getElementById('red-count')!
    const black=fromEvent(document.getElementById('black-btn')!,'click').pipe(
      mapTo(1),
      scan((acc,cur)=>acc+cur,0),
      startWith(0)

    )  
    const red=fromEvent(document.getElementById('red-btn')!,'click').pipe(
      mapTo(1),
      scan((acc,cur)=>acc+cur,0),
      startWith(0)
    )
    
    combineLatest([black,red]).subscribe(res=>{
      blackSpan.innerHTML=res[0].toString()
      redSpan.innerHTML=res[1].toString()
    })
  }
  //if order matters then use concat , because it first wait to complete all the
    //observable then emits
    //but merge start emmiting and order will be not maintained
    ///only thing is , both merge multiple observable in single

    //zip operator , combines all the observalbe then emits
    understandMerge(){
      const sourceOne=of(1,2,3,4)
      const sourceTwo=of("atul")
      const sourceThree=of("prakash")
      merge(sourceOne,sourceTwo,sourceThree).subscribe((res)=>{
        console.log("understand merge",res)
      })
      //output 1,2,3,4,atul, praksh

      merge(sourceOne.pipe(delay(3000)),
        sourceTwo.pipe(delay(1000)),
        sourceThree.pipe(delay(2000))).subscribe((res)=>{
        console.log("understand merge when delay",res)
      })
      //output atul,prakash,1,2,3,4
    }
    understandConcat(){
      const sourceOne=of(1,2,3,4)
      const sourceTwo=of("atul")
      const sourceThree=of("prakash")
      concat(sourceOne,sourceTwo,sourceThree).subscribe((res)=>{
        console.log("understand concat",res)
      })
      //output 1,2,3,4,atul, praksh

      concat(sourceOne.pipe(delay(3000)),
        sourceTwo.pipe(delay(1000)),
        sourceThree.pipe(delay(2000))).subscribe((res)=>{
        console.log("understand concat when delay",res)
      })
      //again same output  1,2,3,4,atul, praksh
    }
    understandZip(){
      const sourceOne=of(["hello"])
      const sourceTwo=of(["Atul"])
      const sourceThree=of(["Prakash"])
      zip(
        sourceOne,
        sourceTwo.pipe(delay(1000)),
        sourceThree.pipe(delay(2000))
      ).subscribe((res)=>{
        console.log("understand zip",res)
      })

      //one more imp example
      const sourceTime=interval(1000)
      zip(sourceTime,sourceTime.pipe(take(2))).subscribe(res=>{
        console.log("zip and emit until second observable get completed",res)
      })
      //output [0,0], [1,1]
    }

    //bufferTime, we provide time, after that time it
    // emits value as array, till there it will collect it.
    //Untill we stop stop it
    //bufferTime(2000, 1000), it takes second argument too,
    // which means when to start next buffer
    understandBufferTime(){
      const source = interval(500);
      //After 2 seconds have passed, emit buffered values as an array
      const example = source.pipe(bufferTime(2000));
      //Print values to console
      //ex. output [0,1,2]...[3,4,5,6]
      const subscribe = example.subscribe(val =>
        console.log('Buffered with Time:', val)
      );
    }
    /*
     Note the difference between concatMap and mergeMap. 
     Because concatMap does not subscribe to the next 
     observable until the previous completes.
      Contrast this with mergeMap which subscribes immediately to
       inner observables, the observable with the lesser delay
        will emit, followed by the observable which takes more to complete.
    */

        /*
        Why use switchMap?
The main difference between switchMap and other flattening operators
 is the cancelling effect. On each emission the previous inner 
 observable (the result of the function you supplied) is cancelled
  and the new observable is subscribed.
   You can remember this by the phrase switch to a new observable.
This works perfectly for scenarios like typeaheads where
 you are no longer concerned with the response of the 
 previous request when a new input arrives. This also 
 is a safe option in situations where a long lived inner 
 observable could cause memory leaks, for instance
  if you used mergeMap with an interval and forgot 
  to properly dispose of inner subscriptions. Remember,
   switchMap maintains only one inner subscription at a 
   time, this can be seen clearly in the first example.
Be careful though, you probably want to avoid switchMap
 in scenarios where every request needs to complete,
  think writes to a database. switchMap could cancel 
  a request if the source emits quickly enough. In
   these scenarios mergeMap is the correct option.
        
        */

   //share is used to share source between multiple observaleb
}
