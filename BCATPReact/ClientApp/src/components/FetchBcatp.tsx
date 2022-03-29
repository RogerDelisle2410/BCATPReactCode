import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import "react-awesome-lightbox/build/style.css";
import './global.js';
import TableScrollbar from 'react-table-scrollbar';
import editpng from './img/pencil.png';
import deletepng from './img/trash.png';
import mappng from './img/map.png';
import ModalImage from "react-modal-image";
import Modal from "react-modal";
import ReactTooltip from 'react-tooltip';

///*  taskkill /f /im node.exe  */  

interface FetchBcatpDataState {
    bcatpList: BcatpData[];
    maintList: MaintData[];
    loading: boolean;
    value: string;
    open: boolean;
}

export class FetchBcatp extends React.Component<RouteComponentProps<{}>, FetchBcatpDataState> {
    value2: string;
    static: true;
    tabName: string;
    tabNam2: string;
    searchName: string;
    tabId: number;
    aaa: string;

    constructor(props) {
        super(props.match.params.tableName);
        this.tabName = props.match.params.tableName;
        global.tableName = props.match.params.tableName;
        this.tabNam2 = this.tabName.charAt(0).toUpperCase() + this.tabName.slice(1);

        //Get the wiki data link
        fetch("api/MaintData/Details/" + this.tabName)
            .then(response => response.json() as Promise<MaintData>)
            .then(data => {
                this.setState({ maintList: [], loading: false });
                global.wikiLink = data[0].wiki;
            });

        this.searchName = global.searchValue;

        this.state = { bcatpList: [], maintList: [], loading: true, value: "", open: false };

        if (this.searchName == "" || this.searchName == null) {
            this.searchName = 'undefined';
        }

        if (this.searchName == "" || this.searchName == null || this.searchName == 'undefined') {

            fetch("api/AllData/Index/" + this.tabName)
                .then(response => response.json() as Promise<BcatpData[]>)
                .then(data => {
                    this.setState({
                        bcatpList: data, loading: false
                    });
                });
        }
        else {
            fetch("api/AllData2/Index/" + this.tabName + "/" + this.searchName)
                .then(response => response.json() as Promise<BcatpData[]>)
                .then(data => {
                    this.setState({
                        bcatpList: data, loading: false
                    });
                });

            // This binding is necessary to make "this" work in the callback  
            this.handleDelete = this.handleDelete.bind(this);
            this.handleEdit = this.handleEdit.bind(this);
            this.handleMap = this.handleMap.bind(this);
            this.handleImage = this.handleImage.bind(this);
        }
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderBcatpTable(this.state.bcatpList);

        return <div>
            {contents}
        </div>;
    }

    // Handle Delete request for an bcatp
    private handleDelete(id: number, name: string) {
        if (!window.confirm("Do you want to delete " + this.tabNam2 + " item: " + id + " " + name + "?"))
            return;
        else {
            fetch("api/AllData/Delete/" + id, {
                method: 'delete'
            }).then(data => {
                this.setState(
                    {
                        bcatpList: this.state.bcatpList.filter((rec) => {
                            return (rec.id != id);
                        })
                    });
            });
        }
    }

    public handleCreateNew() {
        this.props.history.push("/addbcatp");
    }

    public handleImage(id: number, name: string, wiki: string) {
        global.itemName = name;
        global.itemWiki = wiki;
        this.props.history.push("/" + this.tabName + "/image/" + id);
    }

    private handleEdit(id: number) {
        this.props.history.push("/" + this.tabName + "/edit/" + id);
    }
    public handleMaint() {
        this.props.history.push("/" + this.tabName + "/maint/");

    }
    private handleMap(id: number) {
        this.props.history.push("/" + this.tabName + "/map/" + id);
    }

    deleteSearch = (event) => {
        event.target.value = "";
        global.searchValue = "";
        this.display(event);
    }

    handleSearch = (event) => {
        this.display(event);
    }


    private display(event) {

        if (event.target.value == " " || event.target.value == null || event.target.value == "") {
            global.searchValue = event.target.value;
            fetch("api/AllData/Index/" + this.tabName)
                .then(response => response.json() as Promise<BcatpData[]>)
                .then(data => {
                    this.setState({
                        bcatpList: data, loading: false
                    });
                });
        } else {

            global.searchValue = event.target.value;
            fetch("api/AllData2/Index/" + this.tabName + "/" + event.target.value)
                .then(response => response.json() as Promise<BcatpData[]>)
                .then(data => {
                    this.setState({ bcatpList: data, loading: false });
                });
        }
    }
    // Returns the HTML table to the render() method.  
    private renderBcatpTable(bcatpList: BcatpData[]) {
        if (this.tabName != 'tanks' && this.tabName != 'planes' && this.tabName != 'ships') {
            const empty = null;
            return (
                <>
                    <div className="flexbox-container topHeader" style={{ height: '35px' }}>
                        <div className='form1'>
                            <input className='input1' placeholder="Search" value={global.searchValue} onChange={this.handleSearch} />
                        </div>
                        <div className=' '>
                            <button className='button1' onClick={this.deleteSearch} style={{ width: '20px' }}>X</button>
                        </div>
                        <div style={{ width: '420px' }}></div>
                        <div>
                            <h3>
                                <a style={{ width: '210px', fontWeight: 'bold' }} href={global.wikiLink} target="_blank"> {this.tabNam2}
                                </a>
                            </h3>
                        </div>
                        <div style={{ width: '450px' }}></div>
                        <div style={{ float: 'right', width: '100px' }}>
                            <button className='button2' onClick={(id) => this.handleCreateNew()} >Create</button>
                        </div>
                        <div style={{ float: 'right', width: '100px' }}>
                            <button className='button2' onClick={(id) => this.handleMaint()} >Maint</button>
                        </div>
                    </div>
                    <table>
                        <tr>
                            <th style={{ width: '40px', height: '10px' }}></th>
                            <th style={{ width: '200px', height: '10px' }}>Name</th>
                            <th style={{ width: '140px', height: '10px' }}>Longitude</th>
                            <th style={{ width: '160px', height: '10px' }}>Latitude</th>
                            <th style={{ width: '10px', height: '10px' }}>Comment</th><th></th>
                        </tr>
                    </table>
                    <TableScrollbar rows={8}>
                        <table className='table' >
                            <tbody className='table1'>
                                {bcatpList.map(bca => <tr key={bca.id}>
                                    <td style={{ width: '10px' }}></td>
                                    {(() => {
                                        if (bca.wiki != "") {
                                            return <td style={{ width: '200px', fontWeight: 'bold' }}>
                                                <a href={bca.wiki} target="_blank"> {bca.name}</a>
                                            </td>;
                                        }
                                        return <td style={{ width: '200px', fontWeight: 'bold' }}>{bca.name}</td>
                                    })()}
                                    <td style={{ width: '150px' }}>{bca.longitude}</td>
                                    <td style={{ width: '150px' }}>{bca.latitude}</td>
                                    <td style={{ width: '350px' }}>{bca.comment}</td>
                                    <td>
                                        <button className="action2" onClick={(id) => this.handleEdit(bca.id)} data-tip data-for="editTip">
                                            <img height="25px" width="25px" src={editpng} />

                                        </button>
                                        <button className="action2" onClick={(id) => this.handleDelete(bca.id, bca.name)} data-tip data-for="deleteTip">
                                            <img height="25px" width="25px" src={deletepng} />

                                        </button>
                                        <button className="action2" onClick={(id) => this.handleMap(bca.id)} data-tip data-for="mapTip">
                                            <img height="25px" width="25px" src={mappng} />

                                        </button>
                                        <ReactTooltip id="editTip" place="top" effect="solid">Edit</ReactTooltip>
                                        <ReactTooltip id="deleteTip" place="top" effect="solid">Delete</ReactTooltip>
                                        <ReactTooltip id="mapTip" place="top" effect="solid">Map</ReactTooltip>
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </TableScrollbar><td style={{ fontWeight: 'bold' }}>JRD.Consulting@hotmail.com (2022)</td>
                </>
            );
        }
        else {
            return (
                <>
                    <div className="flexbox-container topHeader" style={{ height: '35px' }}>

                        <div className='form1'>
                            <input className='input1' placeholder="Search" value={global.searchValue} onChange={this.handleSearch} />
                        </div>
                        <div className=' '>
                            <button className='button1' onClick={this.deleteSearch} style={{ width: '20px' }}>X</button>
                        </div>

                        <div style={{ width: '420px' }}></div>
                        <div>
                            <h3>
                                <a style={{ width: '210px', fontWeight: 'bold' }} href={global.wikiLink} target="_blank"> {this.tabNam2}
                                </a>
                            </h3>
                        </div>
                        <div style={{ width: '450px' }}></div>
                        <div style={{ float: 'right', width: '100px' }}>
                            <button className='button2' onClick={(id) => this.handleCreateNew()} >Create</button>
                        </div>
                        <div style={{ float: 'right', width: '100px' }}>
                            <button className='button2' onClick={(id) => this.handleMaint()} >Maint</button>
                        </div>
                    </div>

                    <TableScrollbar rows={15}>
                        <table className='table1 '>
                            <tbody className='grid2x2 table1'>
                                {bcatpList.map(bca => <tr className="tr2"
                                    key={bca.id}>
                                    <td style={{ width: '5px' }}></td>
                                    {(() => {
                                        if (bca.wiki != "") {
                                            return <td style={{ width: '140px', fontWeight: 'bold' }}>
                                                <a href={bca.wiki} target="_blank"> {bca.name}</a>
                                            </td>;
                                        }
                                        return <td style={{ width: '140px', fontWeight: 'bold' }}>{bca.name}</td>
                                    })()}
                                    <td style={{ width: '100px', alignContent: 'center' }}>
                                        <img alt="no image" src={bca.comment} width={100} height={70} onClick={(id) => this.handleImage(bca.id, bca.name, bca.wiki)} />
                                        {/*<ModalImage*/}
                                        {/*    small={bca.comment} className='ModalImagePic' medium={bca.comment} hideDownload hideZoom >*/}
                                        {/*    <a href={bca.wiki} target="_blank"> {bca.name}</a>*/}
                                        {/*</ModalImage>*/}
                                    </td>
                                    <td style={{ width: '100px' }}>
                                        <button className="action" onClick={(id) => this.handleEdit(bca.id)} data-tip data-for="editTip">
                                            <img height="25px" width="25px" src={editpng} />

                                        </button>
                                        <button className="action" onClick={(id) => this.handleDelete(bca.id, bca.name)} data-tip data-for="deleteTip">
                                            <img height="25px" width="25px" src={deletepng} />

                                        </button>
                                        <ReactTooltip id="editTip" place="top" effect="solid">Edit</ReactTooltip>
                                        <ReactTooltip id="deleteTip" place="top" effect="solid">Delete</ReactTooltip>
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </TableScrollbar><td style={{ fontWeight: 'bold' }}>JRD.Consulting@hotmail.com (2022)</td>
                </>
            );
        }
    }
}

export class BcatpData {
    id: number = 0;
    name: string = "";
    longitude: number;
    latitude: number;
    comment: string = "";
    wiki: string = "";
    type: number;
}
export class MaintData {
    id: number = 0;
    name: string = "";
    longitude: number;
    latitude: number;
    comment: string = "";
    wiki: string = "";
    type: number;
} 