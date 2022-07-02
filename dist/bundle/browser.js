!function(e){"use strict";function n(e,n,t,r){
return new(t||(t=Promise))((function(a,o){
function u(e){try{c(r.next(e))}catch(e){o(e)}}
function i(e){try{c(r.throw(e))}catch(e){o(e)}}
function c(e){var n
;e.done?a(e.value):(n=e.value,n instanceof t?n:new t((function(e){
e(n)}))).then(u,i)}c((r=r.apply(e,n||[])).next())
}))}function t(e,n){var t,r,a,o,u={label:0,
sent:function(){if(1&a[0])throw a[1];return a[1]},
trys:[],ops:[]};return o={next:i(0),throw:i(1),
return:i(2)
},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){
return this}),o;function i(o){return function(i){
return function(o){
if(t)throw new TypeError("Generator is already executing.")
;for(;u;)try{
if(t=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),
0):r.next)&&!(a=a.call(r,o[1])).done)return a
;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:
case 1:a=o;break;case 4:return u.label++,{
value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0]
;continue;case 7:o=u.ops.pop(),u.trys.pop()
;continue;default:
if(!(a=u.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){
u=0;continue}
if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){
u.label=o[1];break}if(6===o[0]&&u.label<a[1]){
u.label=a[1],a=o;break}if(a&&u.label<a[2]){
u.label=a[2],u.ops.push(o);break}
a[2]&&u.ops.pop(),u.trys.pop();continue}
o=n.call(e,u)}catch(e){o=[6,e],r=0}finally{t=a=0}
if(5&o[0])throw o[1];return{
value:o[0]?o[1]:void 0,done:!0}}([o,i])}}}
function r(e){
return n(this,void 0,void 0,(function(){var n
;return t(this,(function(t){switch(t.label){
case 0:n=0,t.label=1;case 1:
return n<e?[4,Promise.resolve()]:[3,4];case 2:
t.sent(),t.label=3;case 3:return n++,[3,1];case 4:
return[2]}}))}))}
e.awaitCount=r,e.awaitTime=function(e,a,o){
return n(this,void 0,void 0,(function(){var n
;return t(this,(function(t){switch(t.label){
case 0:return[4,r(o)];case 1:
t.sent(),n=0,t.label=2;case 2:
return n<a?(e.addTime(1),[4,r(o)]):[3,5];case 3:
t.sent(),t.label=4;case 4:return n++,[3,2];case 5:
return[2]}}))}))
},Object.defineProperty(e,"__esModule",{value:!0})
}({});
