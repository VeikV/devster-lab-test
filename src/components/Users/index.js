import $ from 'jquery';
import v4 from 'uuid/v4';
import 'jquery-validation';
import serialize from 'form-serialize';
import { debounce, get, some, zipObjectDeep } from 'lodash';
import template from './users.hbs';

export default class Users {
    constructor(node) {
        const $root = $(node);

        this.query = '';
        this.sort = 'name';
        this.users = null;
        this.position = null;

        this.elements = {
            $root,
            $form: $root.find('.users__create'),
            $list: $root.find('.users__list')
        };

        $("#phone").mask('(999) 999-9999');

        $.validator.addMethod('uniq', (value, element) => {
            const prop = $(element).prop('name');

            return !some(this.users, zipObjectDeep([prop], [value]));
        }, 'Should be unique');

        $.validator.addMethod('website', value => {
            return value.match(/[a-z]+\.{1}[a-z]{2,4}/ig);
        }, 'Should be xxx.xxx');

        $.validator.addMethod('phone', value => {
            return value.match(/\([0-9]{3}\)\s{1}[0-9]{3}-[0-9]{4}/ig);
        }, 'Should be (xxx) xxx-xxxx');

        navigator.geolocation.getCurrentPosition(position => {
            this.position = position;

            this.getUsers();
            this.attachEvents();
            this.elements.$form.validate({
                rules: {
                    name: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true,
                        uniq: true
                    },
                    username: {
                        required: true,
                        uniq: true
                    },
                    'company.name': {
                        required: true,
                        uniq: true
                    },
                    website: {
                        website: true
                    },
                    phone: {
                        phone: true
                    }
                },
                highlight: element => {
                    $(element).parent().addClass('has-danger');
                },
                unhighlight: element => {
                    $(element).parent().removeClass('has-danger');
                }
            });
        });
    }

    attachEvents() {
        this.elements.$root.on('click', '.users__submit', this.createUser);
        this.elements.$root.on('click', '.users__clear', this.clearForm);
        this.elements.$root.on('keyup', '.users__query', debounce(this.queryUsers, 200));
        this.elements.$root.on('change', '.users__sort', this.sortUsers);

    }

    queryUsers = event => {
        this.query = event.target.value;

        this.filterUsers();
    };

    sortUsers = event => {
        this.sort = event.target.value;

        this.filterUsers();
    };

    filterUsers() {
        const queryUsers = this.users.filter(user => user.name.toLowerCase().includes(this.query) || user.email.includes(this.query) || user.username.includes(this.query));;
        const users = queryUsers.sort((user, nextUser) => get(user, this.sort) > get(nextUser, this.sort));

        this.render(users);
    }

    clearForm = () => {
        this.elements.$form.data('validator').resetForm();
        this.elements.$form[0].reset();
    };

    createUser = (event) => {
        const isValid = this.elements.$form.valid();

        $(event.target).prop('disabled', !isValid);

        if (isValid) {
            const data = serialize(this.elements.$form[0], { hash: true });
            const newUser = Object.keys(data).reduce((prev, name) => {
                const deepProp = zipObjectDeep([name], [data[name]]);

                return {
                    ...prev,
                    ...deepProp,
                    id: v4(),
                    address: {
                        geo: {
                            lat: 1,
                            lng: 1
                        }
                    }
                };
            }, {});

            this.users.push(newUser);
            this.filterUsers();

            this.elements.$root.find('#myModal').modal('hide');
        }
    };

    getUsers() {
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/users',
            success: users => {
                this.users = users;

                this.filterUsers();
            }
        });
    }

    render(users) {
        this.elements.$list.html(template({
            users,
            position: this.position,
            query: this.query
        }));
    }
};
