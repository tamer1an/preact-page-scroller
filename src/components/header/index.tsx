import { h } from 'preact';
import {signal} from '@preact/signals';
import {useEffect, useRef} from 'preact/hooks';
import {fetchFileContent} from './fetchUtils';
import Hammer from 'hammerjs';

// Define signals outside the component
const fileContent = signal('');
const loading = signal(true);
const error = signal(null);

// Call the fetch function immediately to load data
fetchFileContent(fileContent, loading, error);

const regex = /#+/g;
const columns = 3;
const Header = () => {
		const containerRef = useRef(null);
		if (loading.value) return <p>Loading...</p>;
		if (error.value) return <p>Error loading file: {error.value}</p>;

		const text = fileContent.value.replaceAll(regex,'<br>');
		const words = text.split(' ');
		const wordsPerColumn = Math.ceil(words.length / columns);

		useEffect(() => {
			if (containerRef.current) {
				for (let i = 0; i < columns; i++) {
					const columnText = words.slice(i * wordsPerColumn, (i + 1) * wordsPerColumn).join(' ');
					// Create a new div and add the text
					const columnDiv = document.createElement('div');
					columnDiv.classList.add('scroll-item');
					columnDiv.textContent = columnText;
					const hammer = new Hammer(columnDiv);
					hammer.on('panleft', (e) => {
						// Scroll the element to the right
						e.target.parentElement.scrollLeft += 360;
					});
					hammer.on('panright', (e) => {
						// Scroll the element to the left
						e.target.parentElement.scrollLeft -= 360;
					});
					containerRef.current.appendChild(columnDiv);
				}
			}
		},[])

		return (
			<div>
				<p>File Content:</p>
				<div id="app">
					<main>
						<div class="scroll-container" ref={containerRef}>
						</div>
					</main>
				</div>
			</div>
);
}
;

export default Header;
