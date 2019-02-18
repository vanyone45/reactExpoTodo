import React from 'react';
import { View, Text ,Alert} from 'react-native';
import { Container, Header, Left, Body, Right, 
    Button, Icon, Title, Spinner,
    Item,Input,List,ListItem,Form,Label  } from 'native-base';
import {Constants,Font,SQLite} from 'expo';

const db = SQLite.openDatabase('db_todo.db');

export default class Addscreen extends React.Component {
    static navigationOptions = {
        // headerTitle instead of title
        header: null,
      };

      state = {loading:true,label:''};
      
      async componentWillMount() {
        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
          Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        });    
        // await this.loadData();
        this.setState({loading:false});
    
      }

      insert(label) {
		var query = "INSERT INTO m_todo (id,label) VALUES (null,?)";
		var params = [label];
		db.transaction((tx) => {
			tx.executeSql(query,params, (tx, results) => {
                console.log(results);
                Alert.alert("Success","Data berhasil disimpan");
			}, function(tx,err){
                Alert.alert("Warning","Terjadi kesalahan disisi server." + err);
                return;
			});
		});
    }
    
    handleSave(){
        const {label} = this.state;
        if(label == ""){
            Alert.alert("Warning","Label tidak boleh kosong.");
        }else{
            this.insert(label);
        }
    }

    handleBack(){
        // const nav  = this.props.navigation;
        // nav.goBack();
        this.props.navigation.navigate("Home");
    }

    render() {
        
        if(this.state.loading){
            return (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Spinner color="green" />
                </View>
            );
        }
      return (
        <View style={{ flex: 1}}>
            <View style={{flex:0.1,marginTop:Constants.statusBarHeight}}>
                <Header>
                    <Left style={{flex:0.1,marginRight:8}}>
                        <Button transparent onPress={()=>this.handleBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    
                    <Body style={{flex:0.9}}>
                        <Title>Tambah Todo</Title>
                    </Body>
                </Header>
            </View>
            
            <View style={{flex:0.8,marginTop:10}}>
                
                    <Form>
                        <Item inlineLabel>
                            <Label>Label</Label>
                            <Input onChangeText={(val)=>this.setState({label:val})} value={this.state.label}/>
                        </Item>
                    </Form>
                
            </View>
            <View style={{flex:0.1,justifyContent:'flex-end',alignItems:'flex-end'}}>
                <Button full primary onPress={()=>this.handleSave()}>
                    <Text style={{color:'#FFF'}}>Simpan</Text>
                </Button>
            </View>
        </View>
      );
    }
  }
  