//budgetcontroller:-In this only the calculation of budget and storing in data structure is done in this module.

var budgetcontroller=(function(){
    var expense=function(id,description,value){//this is the function constructor that takes argument of id,desc and value
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;


    };

    expense.prototype.calcpercentage=function(totalincome){
        if(totalincome>0){
            this.percentage=Math.round((this.value/totalincome)*100);
        }else{
            this.percentage=-1;
        }
    };

    expense.prototype.getpercentage=function(){
        return this.percentage;
    }
    var income=function(id,description,value){//same as above
        this.id=id;
        this.description=description;
        this.value=value;


    };

    var calculatetotal=function(type){
        var sum=0;
        data.allitems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.total[type]=sum;
       
    };

    var data={//this is the object data structure that stores the income and expense
        allitems:{
            exp:[],
            inc:[]
        },

        total:{
            exp:0,
            inc:0

        },
        budget:0,
        percentage:-1
        
    };

    return{
        additem: function(type,des,val){//this is the function that returns the data to outside so that it can be available to other module
            var newitem,ID;
            if(data.allitems[type].length>0){
                ID=data.allitems[type][data.allitems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            
            
           if(type==='exp'){
            newitem=new expense(ID,des,val);
           }else if(type==='inc'){
            newitem=new income(ID,des,val);
           }
           data.allitems[type].push(newitem);
           return newitem;
            


        },
        deleteitem:function(type,id){
            var ids,index;
            var ids=data.allitems[type].map(function(current){//map returns a brand new set of arrays
                return current.id;
            })

            index=ids.indexOf(id)
            if(index!==-1){
                data.allitems[type].splice(index,1);
            }
        },

        calculatebudget:function(){
            //calculate total income and expenses 
            calculatetotal('exp');
            calculatetotal('inc');

            //calculate the budget:income-expenses
            data.budget=data.total.inc-data.total.exp;

            //calculate the percentage of income that we spent
            if(data.total.inc>0){
                data.percentage=Math.round((data.total.exp/data.total.inc)*100);
            }
            else{
                data.percentage=-1;
            }
           

        },
        calculatepercentage: function(){
            data.allitems.exp.forEach(function(cur){
                cur.calcpercentage(data.total.inc);


            });

        },
        getpercentages:function(){
            var allperc=data.allitems.exp.map(function(cur){
                return cur.getpercentage();
            });
            return allperc;
        },
        getbudget:function(){
            return{
                budget:data.budget,
                totalinc:data.total.inc,
                totalexp:data.total.exp,
                percentage:data.percentage
            };

        },

        testing:function(){
            console.log(data);
        }
    };

})();

//uicontroller

var uicontroller=(function(){

    var domstrings={
        inputtype:'.add__type',
        inputdescription:'.add__description',
        inputvalue:'.add__value',
        inputbtn:'.add__btn',
        incomecontainer:'.income__list',
        expensescontainer:'.expenses__list',
        budgetlabel:'.budget__value',
        incomelabel:'.budget__income--value',
        expenselabel:'.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        container:'.container',
        expperclable:'.item__percentage',
        datelabel:'.budget__title--month'

    };
   var formatnumber=function(num,type){
        var numsplit,int,dec;
        num=Math.abs(num);
        num=num.toFixed(2);
        numsplit=num.split('.');
        int=numsplit[0];
        
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);

        }
        dec=numsplit[1];
        ;
        return (type==='exp'? '-':'+')+' ' +int +'.'+dec;

    };
    
    var nodelistforeach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };
   
    return{
        getinput:function(){

            return{
                 type: document.querySelector(domstrings.inputtype).value,//either inc or expense
                 description: document.querySelector(domstrings.inputdescription).value,
                 value:parseFloat( document.querySelector(domstrings.inputvalue).value)

            }
           

        },

        addlistitem:function(obj,type){
            //create html strings with placeholder
           var html,newhtml,element;    
           if(type==='inc')
           { 
            element=domstrings.incomecontainer;
            html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
           else if(type==='exp'){
               element=domstrings.expensescontainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
           }

            //replace the placeholder text with actual data
        newhtml=html.replace('%id%',obj.id);
        newhtml=newhtml.replace('%description%',obj.description);
        newhtml=newhtml.replace('%value%',formatnumber(obj.value,type));


            //insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);



        },
        deletelistitem:function(selectorid){
            var ele=document.getElementById(selectorid)
            ele.parentNode.removeChild(ele);

        },

        clearfields:function(){
            var fields, fieldsarr;
            fields=document.querySelectorAll(domstrings.inputdescription + ',' + domstrings.inputvalue);//this returns the list but we want array so we need to convert this list to array
           fieldsarr= Array.prototype.slice.call(fields);//by using this we will convert the list to array

            fieldsarr.forEach(function(current,index,array){
                current.value="";

            });

            fieldsarr[0].focus();
            


        },
        displaybudget:function(obj){
            obj.budget>0 ?type='inc':type='exp';
            document.querySelector(domstrings.budgetlabel).textContent=formatnumber(obj.budget,type);
            document.querySelector(domstrings.incomelabel).textContent=formatnumber(obj.totalinc,'inc');
            document.querySelector(domstrings.expenselabel).textContent=formatnumber(obj.totalexp,'exp');
            

            if(obj.percentage>0){
                document.querySelector(domstrings.percentagelabel).textContent=obj.percentage+'%';

            }
            else{
                document.querySelector(domstrings.percentagelabel).textContent='---';
            }


        },
        displayperc:function(percentages){
           // var fieldsarr;
            var fields=document.querySelectorAll(domstrings.expperclable);
            /*fieldsarr= Array.prototype.slice.call(fields);//by using this we will convert the list to array

            fieldsarr.forEach(function(current,index,array){
                current.textContent=percentages[index]+'%';

            });*/

            nodelistforeach(fields,function(current,index){
                if(percentages[index]>0){
                    current.textContent=percentages[index]+'%';

                }
                else{
                    current.textContent='---';
                }
            });    
           
            

            


        },
        displaymonth:function(){
            var now=new Date();
            var year=now.getFullYear();
            var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            var month=now.getMonth();
            document.querySelector(domstrings.datelabel).textContent=months[month]+' '+year;
        },
        changetype:function(){
            var fields=document.querySelectorAll(
                domstrings.inputtype+','+
                domstrings.inputdescription+','+
                domstrings.inputvalue
            );
            nodelistforeach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(domstrings.inputbtn).classList.toggle('red');

        },
        getdomstrings:function(){
            return domstrings;
               
            
        }

       
    };


})();

//global controller
var controller=(function(bdgtcont,uictrl){

    var setupeventlisteners=function(){
        var dom=uictrl.getdomstrings();
        document.querySelector(dom.inputbtn).addEventListener('click',ctrladditem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13){
                ctrladditem();
                
            }
        });
        document.querySelector(dom.container).addEventListener('click',ctrldeleteitem);
        document.querySelector(dom.inputtype).addEventListener('change',uictrl.changetype);

    };


    var updatebudget=function(){
          //1.calculate the budget
          bdgtcont.calculatebudget();
        
          //2.returns the budget
          var budgt=bdgtcont.getbudget();
            //3.display the budget to ui
            uictrl.displaybudget(budgt);
    };


     var updatepercentages=function(){
        //1.calculate the percentage
        bdgtcont.calculatepercentage();

        //2.read the budget from budget controller
        var percentages=bdgtcont.getpercentages();

        //3.update the ui with new percentages
       uictrl.displayperc(percentages);
     };
    

    var ctrladditem=function(){
        //1.field ip data
        var input=uictrl.getinput();
        if(input.description!=="" && !isNaN(input.value)&& input.value>0){
            //2.add the item to the budget controller
           var newitem= bdgtcont.additem(input.type,input.description,input.value);
           //3.add th new item to user interface
           uictrl.addlistitem(newitem,input.type);
           //for clear the fields
           uictrl.clearfields();

       //5.calculate and update the budget
       updatebudget();
       //6.caluclate and update the percentages
       updatepercentages();

        }
            
          
    };

    var ctrldeleteitem=function(event){
        var itemid,splitid,type,ID;
        itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemid){
            splitid=itemid.split('-');
            type=splitid[0];
            ID=parseInt( splitid[1]);

           // 1.delete the item from dat structure
           bdgtcont.deleteitem(type,ID);


           //delete the item from the ui
           uictrl.deletelistitem(itemid);

           
           //update and show the new budget
           updatebudget();

           updatepercentages();
        }

    };
    
    return{
        init:function(){
            console.log('app is started');
            uictrl.displaybudget({ budget:0,
                totalinc:0,
                totalexp:0,
                percentage:0});
            setupeventlisteners();
            uictrl.displaymonth();
        }
    };

       
})(budgetcontroller,uicontroller);


controller.init();
