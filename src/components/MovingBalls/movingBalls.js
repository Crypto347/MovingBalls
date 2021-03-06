/**
* Libraries
*/

import React,{
    Component
} from 'react';
 
import {
    connect
} from 'react-redux';

import {
    bindActionCreators
} from 'redux';

/**
* Components
*/

import Button from '../../library/Button/button';

/**
* Styles
*/

import './movingBalls.scss';

/**
* Selectors
*/

import * as Selectors from '../../reducers/selectors';

/**
* Actions
*/

import * as Actions from '../../actions';

/**
* Utility
*/

import * as Utility from '../../utility';

/**
 * MovingBalls component definition and export
 */

export class MovingBalls extends Component {

    /**
    * Methods
    */

    componentDidMount() {
        this.updateCanvas();
        this.props.fillCirclesArray();
    }

    updateCanvas = () => {
        const canvas = this.refs.canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = `rgba(${Utility.getRandomColor()}, ${Utility.getRandomColor()}, ${Utility.getRandomColor()}, ${Utility.getRandomAlfa()})`;
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        let circlesArray = [...this.props.circles];
        this.ctx.clearRect(0, 0, (innerWidth - 35), innerHeight);
        circlesArray.map((el, i) => {
            this.ctx.beginPath();
            this.ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2, false);
            this.ctx.strokeStyle = el.color;
            this.ctx.lineWidth = 30;
            this.ctx.fill();
            this.ctx.stroke();

            if(el.x + el.radius > (window.innerWidth-35) || el.x - el.radius < 0){
                this.props.changeDirectionOfXMove(el.id);
            }
    
            if(el.y + el.radius > (window.innerHeight) || el.y - el.radius < 0){
                this.props.changeDirectionOfYMove(el.id);
            }

            this.props.moveCircleXCoordinate(el.dx, el.id);
            this.props.moveCircleYCoordinate(el.dy, el.id);
        })
    }

    onChangeHandler = (event) => {
        this.props.getNumbersOfBalls(event.target.value);
    }

    /**
    * Markup
    */

    render(){
        return(
            <div>
                <div className="movingBall-input">
                    <input placeholder="Choose number of balls" onChange={() => this.onChangeHandler(event)}/>
                    <Button
                        onClick={this.props.fillCirclesArray}
                        text={"Press"}
                        disabled={isNaN(this.props.numberOfBalls)}
                    />
                </div>
                <canvas width={window.innerWidth - 35} height={window.innerHeight} style={{border: "2px solid rgb(83, 83, 83)"}} ref="canvas" ></canvas>
            </div>
        );
    }
}

export default connect(
    (state) => {
        return {
            circles: Selectors.getCirclesState(state),
            numberOfBalls: Selectors.getNumberOfBallsState(state)
        };
    },
    (dispatch) => {
        return {
            moveCircleXCoordinate: bindActionCreators(Actions.moveCircleXCoordinate, dispatch),
            moveCircleYCoordinate: bindActionCreators(Actions.moveCircleYCoordinate, dispatch),
            changeDirectionOfXMove: bindActionCreators(Actions.changeDirectionOfXMove, dispatch),
            changeDirectionOfYMove: bindActionCreators(Actions.changeDirectionOfYMove, dispatch),
            fillCirclesArray: bindActionCreators(Actions.fillCirclesArray, dispatch),
            getNumbersOfBalls: bindActionCreators(Actions.getNumbersOfBalls, dispatch)
        };
    }
)(MovingBalls);
 