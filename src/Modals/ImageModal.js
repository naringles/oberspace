import { Component } from 'react';
import "./Modal.css";
import Cat1 from '../cat1.jpeg'
import {HiX} from "react-icons/hi";


//css 죤나 엉망입니다 ^^~ 고쳐야해요~~~~

class ImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index
        };
    }

    imageChange = (index) => {
        this.setState({
            index: index
        });
    }

    render() {
        return (
          
            <div className="background" onClick={() => this.props.close(null)}>

                <div className="modal"> 
                    <HiX className="Icon_Modal"size="40" color='gray' onClick={() => this.props.close(null)} />
                    <img className="Image" src={Cat1}></img>
                </div>
            </div>
        );
    }
}

export default ImageModal;