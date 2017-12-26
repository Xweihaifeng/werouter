var resourcesJs = [
    "/common/iview/vue.min.js",
    "/common/iview/iview.min.js",
    "/common/iview/axios.min.js",
    "/common/iview/libs/util.js",
    "/common/iview/libs/win.js",
];
var doc = document,
    head = doc.getElementsByTagName('head')[0];

for (var val of resourcesJs){
    var node = doc.createElement('script');
    node.async = true;
    node.charset = 'utf-8';
    node.src = val;
    head.appendChild(node);
};








