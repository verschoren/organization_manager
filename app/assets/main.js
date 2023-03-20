var client = ZAFClient.init();
client.invoke('resize', { width: '100%', height: '500px' });

//on change of demo_mode, update test variable
var test_mode = true;
$('#test_mode').change(function() {
    if(this.checked) {
        test_mode = true;
    } else {
        test_mode = false;
    }
});

$('#remove_users').click(function() {
    handleFlow('remove');
});

$('#add_users').click(function() {
    handleFlow('add');
});

function handleFlow(type){
    client.get('organization').then(function(organization) {
        var domains = organization.organization.domains.split(' ');
        var organization_id = organization.organization.id;

        $('#summary').html('');
        $('#results').empty();
        
        if (domains == null) {
            $('#summary').html(`No domains set.`);
            return;
        }
        if (type == 'add'){
            domains.forEach(function(domain) {
                addUsertoDomain(domain,organization_id);
            });
        }
        if (type == 'remove'){
            removeUsers(domains,organization_id);
        }
    });
}

function removeUsers(domains,organization_id){
    // check all users in organization and remove those that don't match the domain
    let options = {
        contentType: "application/json",
        url: `/api/v2/organizations/${organization_id}/users`,
        type: "GET",
    };

    client.request(options).then((results) => {
        console.log(results);
        var users = results.users;
        var count = 0;
        // loop through users and remove those that don't match the domain
        
        var unmatchedUsers = {"users":[]};

        jQuery.each( users, function( i, user ) {
            if (user.email != null){
                var domain = user.email.split('@')[1];
                
                //check if val.email matches any of the domains in domains
                if (domains.indexOf(domain) == -1) {
                    count++;
                    printOutput(user,'remove');
                    unmatchedUsers.users.push({"id":user.id, "organization_id": null});
                }
            }
        });

        if (count == 0) {
            $('#summary').html(`No users found.`);
            return;
        }

        if (test_mode == false){
            createOrUpdateMany(unmatchedUsers, `Removed ${count} users.`);
        } 
    });
}

function addUsertoDomain(domain,organization_id){
    let options = {
        contentType: "application/json",
        url: `/api/v2/search.json?query=type:user ${domain} -organization:${organization_id}`,
        type: "GET",
    };
    
    client.request(options).then((results) => {
        console.log(results);
        var users = results.results;
        var unmatchedUsers = {"users":[]};

        // loop through users and add them to the organization
        if (results.results.length == 0) {
            $('#summary').html(`No users found.`);
            return;
        } else {
            jQuery.each( users, function( i, user ) {
                printOutput(user,'add');
                unmatchedUsers.users.push({"id":user.id, "organization_id": organization_id});
            });

            if (test_mode == false){
                createOrUpdateMany(unmatchedUsers, `Added ${users.length} users for ${domain}.`);
            }
        }
    });
}

function createOrUpdateMany(unmatchedUsers,message){
    let options_nomatch = {
        contentType: "application/json",
        url: `/api/v2/users/create_or_update_many`,
        type: "POST",
        data: JSON.stringify(unmatchedUsers)
    };
    client.request(options_nomatch).then((update_many) => {
        client.invoke('notify', message);
    });
}

function printOutput(user,type){
    var icon = {
        "color": "blue",
        "path":'<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />'
    }
    if (type == 'remove'){
        icon.color = "red";
        icon.path = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />'
    }

    var output = `<li class="py-4">
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 flex-shrink-0 text-${icon.color}-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">${icon.path}</svg>
            </div>
            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-900">${user.name}</p>
                <p class="truncate text-sm text-gray-500">${user.email}</p>
            </div>
            <div>
                <div data-target="${user.id}" class="show_user inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">View</div>
            </div>
        </div>
    </li>`

    $('#results').append(output);
}

// Navigate to user upon click on div with class show_user
$('body').on('click', '.show_user', function() {
    client.invoke('routeTo', 'user', $(this).data('target'));
});