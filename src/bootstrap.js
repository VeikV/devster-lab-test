import $ from 'jquery';
import * as Components from './components';

const bootstrap = () => {
    Array.from(document.querySelectorAll('[data-components]')).forEach(node => {
        const components = node.dataset.components.split(' ');

        components.forEach(component => {
            if (!$.data(node, component)) {
                $.data(node, component, new Components[component](node));
            }
        });
    });
};

export default bootstrap;
