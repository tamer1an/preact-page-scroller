import { h } from 'preact';
import Book from '../src/components/book';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { shallow } from 'enzyme';

describe.skip('Initial Test of the Header', () => {
	test('Header renders 3 nav items', () => {
		const context = shallow(<Book />);
		expect(context.find('p').text()).toBe('File Content:');
	});
});
