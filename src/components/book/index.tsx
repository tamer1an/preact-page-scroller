import { h } from 'preact';
import {signal} from '@preact/signals';
import {useEffect, useRef} from 'preact/hooks';
import {fetchFileContent} from './fetchUtils';
import {debounce} from 'lodash';
import Hammer from 'hammerjs';

// Define signals outside the component
const fileContent = signal('');
const loading = signal(true);
const error = signal(null);

// Call the fetch function immediately to load data
fetchFileContent(fileContent, loading, error);

const regExpLineBR = /#+/g;
const columns = 3;

const Book = () => {
	const containerRef = useRef(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	if (loading.value) return <p>Loading...</p>;
	if (error.value) return <p>Error loading file: {error.value}</p>;

	const text = fileContent.value.replaceAll(regExpLineBR,'<br>');
	const words = text.split(' ');
	// todo: include BR transformation and page number to remove correction const
	const correction = 20;
	const wordsPerColumn = Math.ceil(words.length / columns - correction);

	const panleft = (e) => {
		// Scroll the element to the right
		e.target.parentElement.scrollLeft += 400;
	}
	const panright = (e) => {
		// Scroll the element to the left
		e.target.parentElement.scrollLeft -= 400;
	}

	const canvasPanLeft = () => {
		// Scroll the element to the right
		console.log('left', 'page scroll Left');
	}
	const canvasPanRight = () => {
		// Scroll the element to the left
		console.log('right', 'page scroll right')
	}

	const debouncedHandlePanLeft = debounce(panleft, 200);
	const debouncedHandlePanRight = debounce(panright, 200);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollLeft = 0;
			for (let i = 0; i < columns; i++) {
				const columnText = words.slice(i * wordsPerColumn, (i + 1) * wordsPerColumn).join(' ');
				// Create a new div and add the text
				const columnDiv = document.createElement('div');
				columnDiv.classList.add('scroll-item');
				columnDiv.textContent = columnText;
				const hammer = new Hammer(columnDiv);
				hammer.on('panleft', debouncedHandlePanLeft);
				hammer.on('panright', debouncedHandlePanRight);
				containerRef.current.appendChild(columnDiv);
			}
		}
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			const dpr = window.devicePixelRatio || 1;
			ctx.scale(dpr, dpr);
			const maxWidth = canvasRef.current.width - 20; // Margin
			const lineHeight = 25;
			const x = 10;
			let y = 25;

			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			ctx.font = '16px Arial';
			ctx.fillStyle = 'white';

			// Split the text into words
			const words = text.split(' ');
			let line = '';

			for (let n = 0; n < words.length; n++) {
				const testLine = `${line + words[n]  } `;
				const metrics = ctx.measureText(testLine);
				const testWidth = metrics.width;

				if (testWidth > maxWidth && n > 0) {
					ctx.fillText(line, x, y);
					line = `${words[n]  } `;
					y += lineHeight;
				} else {
					line = testLine;
				}
			}

			ctx.fillText(line, x, y);
			const hammerCanvas = new Hammer(canvasRef.current);
			hammerCanvas.on('panleft', canvasPanLeft);
			hammerCanvas.on('panright', canvasPanRight);
		}
	},[debouncedHandlePanLeft, debouncedHandlePanRight, text, words, wordsPerColumn]);

	return (
		<div>
			<p>File Content:</p>
			<div id="app">
				<main>
					<section class="scroll-container" ref={containerRef} />
				</main>
				<hr />
				<canvas
					ref={canvasRef}
					width="700"
					height="800"
					className="canvas"
				/>
			</div>
		</div>
	);
};

export default Book;
