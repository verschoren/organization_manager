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

$('#remove_domains').click(function() {
    removeUsers();
});

$('#add_users').click(function() {
    addUsers();
});

function removeUsers() {
    client.get('organization').then(function(data) {
        var domains = data.organization.domains.split(' ');
        var organization_id = data.organization.id;
        
        // check all users in organization and remove those that don't match the domain
        let options = {
            contentType: "application/json",
            url: `/api/v2/organizations/${organization_id}/users`,
            type: "GET",
        };

        client.request(options).then((data) => {
            $('#results').empty();
            var users = data.users;
            var count = 0;

            // loop through users and remove those that don't match the domain
            jQuery.each( users, function( i, val ) {
                if (val.email != null){
                    var domain = val.email.split('@')[1];
                    
                    //check if val.email matches any of the domains in domains
                    if (domains.indexOf(domain) == -1) {
                        count++;
                        var output = `<li class="py-4">
                            <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 flex-shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-sm font-medium text-gray-900">${val.name}</p>
                                    <p class="truncate text-sm text-gray-500">${val.email}</p>
                                </div>
                                <div>
                                    <div data-target="${val.id}" class="show_user inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">View</div>
                                </div>
                            </div>
                        </li>`
    
                        if (test_mode == false){
                            let options_nomatch = {
                                contentType: "application/json",
                                url: `/api/v2/users/${val.id}`,
                                type: "PUT",
                                data: JSON.stringify({
                                    "user": {
                                        "organization_id": null
                                    }
                                })
                            };
                            client.request(options_nomatch).then((data) => {
                                $('#results').append(output);
                            });
                        } else {
                            $('#results').append(output);
                        }
                    }
                }
            });
            $('#summary').html(`Removed ${count} users.`);
        });
    });   
}

function addUsers() {
    client.get('organization').then(function(data) {
        var domains = data.organization.domains;
        var organization_id = data.organization.id;

        $('#results').empty();
        $('#summary').html('');

        if (domains == null) {
            $('#summary').html(`No domains set.`);
            return;
        }
        domains.split(' ').forEach(function(domain) {
            addUsertoDomain(domain,organization_id)
        });
    });   
}

function addUsertoDomain(domain,organization_id){
    let options = {
        contentType: "application/json",
        url: `/api/v2/search.json?query=type:user ${domain} -organization:${organization_id}`,
        type: "GET",
    };
    
    client.request(options).then((data) => {
        var users = data.results;
        // loop through users and add them to the organization
        if (data.results.length == 0) {
            $('#summary').html(`No users found.`);
            return;
        } else {
            $('#summary').html('');
            jQuery.each( users, function( i, user ) {
                var output = `<li class="py-4">
                    <div class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 flex-shrink-0 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
                            </svg>
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

                if (test_mode == false){
                    let options_add = {
                        contentType: "application/json",
                        url: `/api/v2/users/${user.id}`,
                        type: "PUT",
                        data: JSON.stringify({
                            "user": {
                               "organization_id": organization_id
                            }
                        })
                    };
                    client.request(options_add).then((data) => {
                        $('#results').append(output);
                    });
                } else {
                    $('#results').append(output);
                }
            });
            $('#summary').append(`Added ${users.length} users for ${domain}.`);
        }
    });
}

// Navigate to user upon click on div with class show_user
$('body').on('click', '.show_user', function() {
    client.invoke('routeTo', 'user', $(this).data('target'));
});