$(document).ready(function(){
    $('.delete-note').on('click', function(e){
        e.preventDefault();
        console.log('main function for delete');
        var id = $(this).data('id');
        var url = '/delete/'+id;
        console.log('main function for delete'+id+url)
        if(confirm('Delete Note?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Note...');
                    window.location.href='/';
                },
                error: function(err){
                    console.log(err);
                }
            })
        }else {
            console.log('Deletion cancelled');
        }
    });
})