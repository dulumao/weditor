/**
 * Created by yeanzhi on 17/2/26.
 */
'use strict';
import React, {Component} from 'react';
import {formatDate} from './lib/timeRelated';
import {getEditor} from './lib/quillEditor';
import {info} from './components/toast';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem, Divider } from 'rc-menu';
import 'rc-dropdown/assets/index.css';


import {is} from './lib/util';

import printThis from './lib/printThis';
const $ = window.jQuery;
printThis($);

import help from './model/help';
import insert from './model/insert';
import editor from './model/editor';

export default class EditorHeader extends Component {
    static defaultProps ={
        fileOptions:[],
        helpOptions:[]
    }
    constructor() {
        super();
        this.state = {
            panel: 1,
            panelType:''
        };
    }

    componentDidMount() {
    }

    print = () =>{
        $('.ql-editor').printThis({
            pageTitle:'',
            header:null,
            footer:null
        });
    }


    HelpMenuClick = ({key}) =>{
        if(key === '0') {
            help.hotKeysDialog = true;
        }else{
            this.props.helpOptions.forEach(item=>{
                if(item.key === key) {
                    item.onClick(key);
                }
            });
        }
        this.setState({
            panelType:''
        });
    };

    fileMenuClick = ({key}) =>{
        if(key === '0') {
            $('.ql-editor').printThis({
                pageTitle:'',
                header:null,
                footer:null
            });
        }else{
            this.props.fileOptions.forEach(item=>{
                if(item.key === key) {
                    item.onClick(key);
                }
            });
        }
        this.setState({
            panelType:''
        });
    };

    insertMenuClick = ({key}) =>{
        if(key === '0') {
            insert.imageSelection = editor.range;
            insert.openImageDialog = true;
        }else if(getEditor()) {
            let toolbar = getEditor().getModule('toolbar');
            toolbar.handlers['link'].call(toolbar, !(editor.format && editor.format.link));
        }
        this.setState({
            panelType:''
        });
    };

    export = async() => {
        if (getEditor()) {
            // let res = await api.getExportUrl(window.quillEditor.getContents());
            document.getElementById('gf_down_file').src = res.url;
        }
    }

    changePanel(panel) {
        return () => {
            if(panel === 4 || panel === 5) {
                info('稍后开放，敬请期待');
                return;
            }
            this.setState({panel});
        };
    }

    dropdownChange(type) {
        return (visible) =>{
            if(visible) {
                this.setState({
                    panelType:type
                });
            }else{
                this.setState({
                    panelType:''
                });
            }
        };
    }

    renderMenubar() {
        let menu = (
            <Menu selectable={false} onClick={this.HelpMenuClick}>
                <MenuItem key="0">键盘快捷键</MenuItem>
                <Divider />
                {
                    this.props.helpOptions.map(item=>{
                        return(
                            <MenuItem key={item.key}>{item.content}</MenuItem>
                        );
                    })
                }
            </Menu>
        );

        let fileMenu = (
            <Menu selectable={false} onClick={this.fileMenuClick}>
                {
                    this.props.fileOptions.map(item=>{
                        return(
                            <MenuItem key={item.key}>{item.content}</MenuItem>
                        );
                    })
                }
                <Divider />
                <MenuItem key="0">打印</MenuItem>
            </Menu>
        );


        const {panel,panelType} = this.state;
        return(
            <div className="menu-bar">
                <Dropdown
                    trigger={['click']}
                    overlay={fileMenu}
                    animation=""
                    onVisibleChange={this.dropdownChange('file')}
                >
                    <span className={`file-tab ${panelType === 'file' && 'active'}`}>文件</span>
                </Dropdown>

                <Dropdown
                    trigger={['click']}
                    overlay={(
                        <Menu selectable={false} onClick={this.insertMenuClick}>
                            <MenuItem key="0">插入图片</MenuItem>
                            <MenuItem key="1">插入链接</MenuItem>
                        </Menu>
                    )}
                    onVisibleChange={this.dropdownChange('insert')}
                    animation=""
                >
                    <span className={`insert-tab ${panelType === 'insert' && 'active'}`}>插入</span>
                </Dropdown>

                {/*<span className={`view-tab ${panel === 3 ? 'active' : ''}`} onClick={this.changePanel(4)}>视图</span>*/}

                {/*<span className="history-tab" onClick={this.changePanel(4)}>修订历史</span>*/}

                <Dropdown
                    trigger={['click']}
                    overlay={menu}
                    animation=""
                    onVisibleChange={this.dropdownChange('help')}
                >
                    <span className={`help-tab ${panelType === 'help' && 'active'}`} >帮助</span>
                </Dropdown>
            </div>
        );
    }


    render() {
        return (
            <div className="weditor-header">
                {this.renderMenubar()}
            </div>
        );
    }
}
