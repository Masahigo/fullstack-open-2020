(this.webpackJsonpteoria=this.webpackJsonpteoria||[]).push([[0],{15:function(t,e,n){t.exports=n(37)},37:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),o=n(14),c=n.n(o),u=n(4),i=n(3),l=function(t){var e=t.note,n=t.toggleImportance,a=e.important?"make not important":"make important";return r.a.createElement("li",null,e.content,r.a.createElement("button",{onClick:n},a))},f=n(2),m=n.n(f),p=function(){return m.a.get("/api/notes").then((function(t){return t.data}))},s=function(t){return m.a.post("/api/notes",t).then((function(t){return t.data}))},d=function(t,e){return m.a.put("".concat("/api/notes","/").concat(t),e).then((function(t){return t.data}))},b=function(){var t=Object(a.useState)([]),e=Object(i.a)(t,2),n=e[0],o=e[1],c=Object(a.useState)(""),f=Object(i.a)(c,2),m=f[0],b=f[1],h=Object(a.useState)(!0),v=Object(i.a)(h,2),E=v[0],g=v[1];Object(a.useEffect)((function(){p().then((function(t){o(t)}))}),[]),console.log("render",n.length,"notes");var O=E?n:n.filter((function(t){return!0===t.important}));return r.a.createElement("div",null,r.a.createElement("h1",null,"Notes"),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return g(!E)}},"show ",E?"important":"all")),r.a.createElement("ul",null,O.map((function(t){return r.a.createElement(l,{key:t.id,note:t,toggleImportance:function(){return function(t){var e=n.find((function(e){return e.id===t})),a=Object(u.a)(Object(u.a)({},e),{},{important:!e.important});d(t,a).then((function(e){o(n.map((function(n){return n.id!==t?n:e})))})).catch((function(a){alert("the note '".concat(e.content,"' was already deleted from server")),o(n.filter((function(e){return e.id!==t})))}))}(t.id)}})}))),r.a.createElement("form",{onSubmit:function(t){t.preventDefault();var e={content:m,date:(new Date).toISOString(),important:Math.random()>.5};s(e).then((function(t){o(n.concat(t)),b("")}))}},r.a.createElement("input",{value:m,onChange:function(t){console.log(t.target.value),b(t.target.value)}}),r.a.createElement("button",{type:"submit"},"save")))};c.a.render(r.a.createElement(b,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.ec661249.chunk.js.map