var TestUtils=function(e){"use strict"
;function t(e,t,n,r){
return new(n||(n=Promise))((function(a,o){
function i(e){try{c(r.next(e))}catch(e){o(e)}}
function u(e){try{c(r.throw(e))}catch(e){o(e)}}
function c(e){var t
;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){
e(t)}))).then(i,u)}c((r=r.apply(e,t||[])).next())
}))}function n(e,t){var n,r,a,o,i={label:0,
sent:function(){if(1&a[0])throw a[1];return a[1]},
trys:[],ops:[]};return o={next:u(0),throw:u(1),
return:u(2)
},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){
return this}),o;function u(o){return function(u){
return function(o){
if(n)throw new TypeError("Generator is already executing.")
;for(;i;)try{
if(n=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),
0):r.next)&&!(a=a.call(r,o[1])).done)return a
;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:
case 1:a=o;break;case 4:return i.label++,{
value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0]
;continue;case 7:o=i.ops.pop(),i.trys.pop()
;continue;default:
if(!(a=i.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){
i=0;continue}
if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){
i.label=o[1];break}if(6===o[0]&&i.label<a[1]){
i.label=a[1],a=o;break}if(a&&i.label<a[2]){
i.label=a[2],i.ops.push(o);break}
a[2]&&i.ops.pop(),i.trys.pop();continue}
o=t.call(e,i)}catch(e){o=[6,e],r=0}finally{n=a=0}
if(5&o[0])throw o[1];return{
value:o[0]?o[1]:void 0,done:!0}}([o,u])}}}
function r(e,r){
return t(this,void 0,void 0,(function(){var t
;return n(this,(function(n){switch(n.label){
case 0:t=0,n.label=1;case 1:
return t<r?(e.addTime(0),[4,Promise.resolve()]):[3,4]
;case 2:n.sent(),n.label=3;case 3:return t++,[3,1]
;case 4:return[2]}}))}))}
return e.awaitCount=r,e.awaitTime=function(e,a,o){
return t(this,void 0,void 0,(function(){var t
;return n(this,(function(n){switch(n.label){
case 0:return[4,r(e,o)];case 1:
n.sent(),t=0,n.label=2;case 2:
return t<a?(e.addTime(1),[4,r(e,o)]):[3,5];case 3:
n.sent(),n.label=4;case 4:return t++,[3,2];case 5:
return[2]}}))}))
},Object.defineProperty(e,"__esModule",{value:!0
}),e}({});
