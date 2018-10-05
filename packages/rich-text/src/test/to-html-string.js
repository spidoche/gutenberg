/**
 * External dependencies
 */

import { JSDOM } from 'jsdom';

/**
 * Internal dependencies
 */

import { create } from '../create';
import { toHTMLString } from '../to-html-string';

const { window } = new JSDOM();
const { document } = window;

function createNode( HTML ) {
	const doc = document.implementation.createHTMLDocument( '' );
	doc.body.innerHTML = HTML;
	return doc.body.firstChild;
}

describe( 'toHTMLString', () => {
	it( 'should extract recreate HTML 1', () => {
		const HTML = 'one <em>two 🍒</em> <a href="#"><img src=""><strong>three</strong></a><img src="">';
		const element = createNode( `<p>${ HTML }</p>` );

		expect( toHTMLString( create( { element } ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 2', () => {
		const HTML = 'one <em>two 🍒</em> <a href="#">test <img src=""><strong>three</strong></a><img src="">';
		const element = createNode( `<p>${ HTML }</p>` );

		expect( toHTMLString( create( { element } ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 3', () => {
		const HTML = '<img src="">';
		const element = createNode( `<p>${ HTML }</p>` );

		expect( toHTMLString( create( { element } ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 4', () => {
		const HTML = '<em>two 🍒</em>';
		const element = createNode( `<p>${ HTML }</p>` );

		expect( toHTMLString( create( { element } ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 5', () => {
		const HTML = '<em>If you want to learn more about how to build additional blocks, or if you are interested in helping with the project, head over to the <a href="https://github.com/WordPress/gutenberg">GitHub repository</a>.</em>';
		const element = createNode( `<p>${ HTML }</p>` );

		expect( toHTMLString( create( { element } ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 6', () => {
		const HTML = '<li>one<ul><li>two</li></ul></li><li>three</li>';
		const element = createNode( `<ul>${ HTML }</ul>` );
		const multilineTag = 'li';

		expect( toHTMLString( create( { element, multilineTag } ), 'li' ) ).toEqual( HTML );
	} );

	it( 'should serialize neighbouring formats of same type', () => {
		const HTML = '<a href="a">a</a><a href="b">a</a>';
		const element = createNode( `<p>${ HTML }</p>` );

		expect( toHTMLString( create( { element } ) ) ).toEqual( HTML );
	} );

	it( 'should serialize neighbouring same formats', () => {
		const HTML = '<a href="a">a</a><a href="a">a</a>';
		const element = createNode( `<p>${ HTML }</p>` );
		const expectedHTML = '<a href="a">aa</a>';

		expect( toHTMLString( create( { element } ) ) ).toEqual( expectedHTML );
	} );

	it( 'should be able to work from serialized value (without references)', () => {
		expect( toHTMLString( {
			text: 'abc',
			formats: [
				null,
				[ { type: 'strong' } ],
				null,
			],
		} ) ).toEqual( 'a<strong>b</strong>c' );
	} );
} );
