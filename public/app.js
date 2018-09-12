
$("#scrape").on("click", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done(function(data){
        console.log(data)
        window.location = "/"
    })
});


$(".save").on("click", function(event){
    var id = $(this).data("id")
    console.log("hey")
    $.ajax({
        type: "PUT",
        url: "/articles/" + id
    }).done(function(data){
        console.log(data)
        window.location = "/"
    })
})

$(".delete").on("click", function(event){
    var id = $(this).data("id")
    console.log("hey")
    $.ajax({
        type: "PUT",
        url: "delete/articles/" + id
    }).done(function(data){
        console.log(data)
        window.location = "/saved"
    })
})