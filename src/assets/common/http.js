var postAjax=function (data,url,callback) {
  this.$ajax({
    method: 'post',
    url: 'http://192.168.0.102:9000/'+url,
    data: JSON.stringify(data),
    dataType: "json",
    async:false,
  }).then(function(res){
    callback(res.data)
  }).catch(function(err){
  })
}
