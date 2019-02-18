import React from 'react';
import { View, Text ,Alert} from 'react-native';
import { Container, Header, Left, Body, Right, 
    Button, Icon, Title, Spinner,
    Item,Input,List,ListItem  } from 'native-base';
import {Constants,Font,SQLite} from 'expo';

const db = SQLite.openDatabase('db_todo.db');

export default class Homescreen extends React.Component {
    static navigationOptions = {
        // headerTitle instead of title
        header: null,
      };

      state = {loading:true,dataTodo:[],search:''};
      
      async componentWillMount() {
        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
          Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        });

        db.transaction(tx => {
            tx.executeSql(
              'create table if not exists m_todo (id integer primary key not null, label text);'
            ); 
        });

        this.setState({loading:false});
    
      }

      async componentDidMount(){
        const {search} = this.state;
        await this.fetchData(search);
      }
    
      async handleSearch(val){
        this.setState({search:val});
        await this.fetchData(val);
      }

      handleAdd(){
        this.props.navigation.navigate('Add');
      }

      handleView(id){
          this.props.navigation.navigate("Edit",{id});
      }

      fetchData(search) {
		var query = "SELECT * FROM m_todo WHERE label LIKE '%"+search+"%'";
		var params = [];
		db.transaction((tx) => {
			tx.executeSql(query,params, (tx, results) => {
				console.log(results);
				if(results.rows._array.length > 0){
                    this.setState({
                            dataTodo:results.rows._array
                    });
				}

			}, function(tx,err){
				Alert.alert("Warning","Terjadi kesalahan disisi server." + err);
			});
		});
    }
    
    deleteData(id) {
		var query = "DELETE FROM m_todo WHERE id = ?";
		var params = [id];
		db.transaction((tx) => {
			tx.executeSql(query,params, (tx, results) => {
				Alert.alert("Success","Data berhasil dihapus");

			}, function(tx,err){
				Alert.alert("Warning","Terjadi kesalahan disisi server." + err);
			});
		});
    }

    async handleDelete(id){
        const {search} = this.state;
        await this.deleteData(id);
        this.fetchData(search);
    }

    render() {
        
        if(this.state.loading){
            return (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Spinner color="green" />
                </View>
            );
        }

        const listItem = this.state.dataTodo.map((item)=>
            <ListItem key={item.id}>
                <Left>
                    <Text>{item.label}</Text>
                </Left>
                <Right style={{display:'flex',flexDirection:'row'}}>
                    <Button transparent small onPress={()=>this.handleView(item.id)}>
                        <Icon active name="eye" />
                    </Button>
                    <Button transparent small onPress={()=>this.handleDelete(item.id)}>
                        <Icon active name="trash" />
                    </Button>
                </Right>
            </ListItem>
        );

      return (
        <View style={{ flex: 1}}>
            <View style={{flex:0.1,marginTop:Constants.statusBarHeight}}>
                <Header>
                    <Left style={{flex:0.5}}>
                        
                            <Title>Daftar Todo</Title>
                        
                    </Left>
                    
                    <Right style={{flex:0.5}}>
                        <Button transparent onPress={()=>this.handleAdd()}>
                            <Icon name='add' />
                        </Button>
                    </Right>
                </Header>
            </View>
            <View style={{flex:0.1,marginBottom:8}}>
                <Item>
                    <Input placeholder='Pencarian' onChangeText={(val)=>this.handleSearch(val)} value={this.state.search}/>
                    <Icon active name='search' />
                </Item>
            </View>
            <View style={{flex:0.8}}>
                <List>
                    {listItem}
                </List>
            </View>
        </View>
      );
    }
  }
  