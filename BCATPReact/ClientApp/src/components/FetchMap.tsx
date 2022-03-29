import React, { } from 'react';
import GoogleMapReact from 'google-map-react';
import { RouteComponentProps } from 'react-router';
import { BcatpData } from './FetchBcatp';
import 'reactjs-popup/dist/index.css';

/*require('dotenv').config();*/

const Marker = (props: any) => {
    const { color, name, id } = props;
    return (
        <div className="marker"
        />
    );
};

export default Marker;
const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

const defaultOptions = {
    mapTypeControlOptions: {
        fullscreenControl: false,
        mapTypeIds: ['hybrid'],
    },
};

interface FetchMapBcatpDataState {
    title: string;
    loading: boolean;
    bcatpData: BcatpData;
}

export class FetchMap extends React.Component<RouteComponentProps<{}>, FetchMapBcatpDataState> {
    theString: string;
    tabId: number;
    latitude: number;
    longitude: number;
    tabName: string;

    constructor(props) {
        super(props);
        this.state = { title: "", loading: true, bcatpData: new BcatpData };
        this.tabId = props.match.params.Id;
        this.tabName = global.tableName; 
       
        // This will set state for Edit bcatp
        if (this.tabId > 0) {
            fetch("api/AllData/Details/" + this.tabId)
                .then(response => response.json() as Promise<BcatpData>)
                .then(data => {
                    this.setState({ title: "Edit", loading: false, bcatpData: data });
                    this.latitude = data.latitude;
                    this.longitude = data.longitude;
                });
        }
        this.handleCancel = this.handleCancel.bind(this);
    }

    public render() {

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCreateForm();

        return <div>
            {contents}
        </div>;
    }

    // This will handle Cancel button click event.  
    private handleCancel(e) {
        e.preventDefault();
        this.props.history.push("/fetch" + this.tabName + "/" + this.tabName + "");
    }

    private renderCreateForm() {
        const { REACT_APP_GOOGLE_KEY } = process.env;
        return (

            <form> 
                <div className="mapbox" >
                    <GoogleMapReact
                        className="react-map"
                        bootstrapURLKeys={{ key:   REACT_APP_GOOGLE_KEY  }}
                        
                        defaultOptions={defaultOptions}
                        options={map => ({ mapTypeId: map.MapTypeId.SATELLITE, tilt: 0 })}

                        defaultCenter={{ lat: this.state.bcatpData.latitude, lng: this.state.bcatpData.longitude }}
                        defaultZoom={14} 
                        marker={{ lat: this.state.bcatpData.latitude, lng: this.state.bcatpData.longitude }} >

                        <Marker
                            lat={this.state.bcatpData.latitude}
                            lng={this.state.bcatpData.longitude}
                            name="My Marker"
                            color="red"
                        />
                    </GoogleMapReact>
                </div>
                <div className="flexbox-container2">
                    <a className="imageIn2" href={this.state.bcatpData.wiki} target="_blank"> {this.state.bcatpData.name} </a> 
                    <button className="text-dark" onClick={this.handleCancel}>Cancel</button>
                </div>                 
            </form>
        )
    }
} 