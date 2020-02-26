import debounce from 'lodash/debounce';
import random from 'lodash/random';
import React from 'react';
import styled from 'styled-components';

class Circle {
  private dx: number;
  private dy: number;
  private color: string;

  constructor(private x: number, private y: number, private radius: number) {
    const speedMultiplier = Math.log(radius);

    const dx = random(1, speedMultiplier);
    this.dx = dx * (random(0, 1) ? 1 : -1);

    const dy = random(1, speedMultiplier);
    this.dy = dy * (random(0, 1) ? 1 : -1);

    const hueA = [0, 50];
    const hueB = [225, 275];
    const hue = random(0, 1)
      ? random(hueA[0], hueA[1])
      : random(hueB[0], hueB[1]);

    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  animate(width: number, height: number, ctx: CanvasRenderingContext2D): void {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.draw(ctx);
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: stretch;

  #linesCanvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export default class balls extends React.Component {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private balls: Circle[] = [];
  private animationFrame = 0;

  constructor(props = {}) {
    super(props);

    this.onResize = this.onResize.bind(this);
    this.draw = this.draw.bind(this);
    this.init = this.init.bind(this);
  }

  private isNull(o: any): o is null {
    return o === null;
  }

  private generateBalls(): void {
    this.balls = [];

    const windowArea = window.innerHeight * window.innerWidth;
    const density = 4500;
    let ballsCount = Math.ceil(windowArea / density);

    const maxRadius = 35 * window.devicePixelRatio;
    const minRadius = 10;

    while (ballsCount--) {
      const radius = random(minRadius, maxRadius);
      const x = random(radius, this.width - radius * 2);
      const y = random(radius, this.height - radius * 2);

      this.balls.push(new Circle(x, y, radius));
    }
  }

  private resetCanvas(): void {
    cancelAnimationFrame(this.animationFrame);

    if (this.isNull(this.canvasRef.current)) {
      return;
    }

    this.width =
      (this.canvasRef.current.parentElement?.offsetWidth || 0) *
      window.devicePixelRatio;
    this.height =
      (this.canvasRef.current.parentElement?.offsetHeight || 0) *
      window.devicePixelRatio;

    this.canvasRef.current.width = this.width;
    this.canvasRef.current.height = this.height;

    this.ctx = this.canvasRef.current.getContext('2d');

    this.generateBalls();
  }

  private draw(): void {
    if (this.isNull(this.ctx)) {
      return;
    }

    this.ctx.fillStyle = '#222222';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.balls.forEach(b =>
      b.animate(this.width, this.height, this.ctx as CanvasRenderingContext2D)
    );

    this.animationFrame = requestAnimationFrame(this.draw);
  }

  private init(): void {
    debounce(() => {
      this.resetCanvas();
      this.draw();
    }, 1000 / 60)();
  }

  private onResize() {
    this.init();
  }

  componentDidMount() {
    this.init();

    window.addEventListener('resize', this.onResize);
  }

  componentWillMount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate() {
    this.init();
  }

  render() {
    return (
      <Wrapper>
        <canvas ref={this.canvasRef} id="linesCanvas" />
      </Wrapper>
    );
  }
}
