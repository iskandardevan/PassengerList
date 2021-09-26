import { Component, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import PassengerInput from './PassengerInput';
import ListPassenger from './ListPassenger';
import Header from './Header';
import { useQuery, useLazyQuery, gql, useSubscription, useMutation } from '@apollo/client';


const getAllAnggota= gql`
query MyQuery {
    ANGGOTA {
        ID
        JENIS_KELAMIN
        NAMA
        UMUR
    }
}`;

const getAllAnggotaSubs= gql `subscription MySubscription {
    ANGGOTA {
        ID
        JENIS_KELAMIN
        NAMA
        UMUR
        }
    }
    `;

const getById = gql `
query MyQuery($_eq: Int!) {
    ANGGOTA(where: {ID: {_eq: $_eq}}) {
        ID
        JENIS_KELAMIN
        NAMA
        UMUR
        }
    }
    
`;

const getByGender = gql `
query MyQuery($_eq: String!) {
    ANGGOTA(where: {JENIS_KELAMIN: {_eq: $_eq}}) {
        ID
        JENIS_KELAMIN
        NAMA
        UMUR
        }
    }
    
`;

const insertPengunjung = gql `mutation MyMutation($JENIS_KELAMIN: String!, $NAMA: String!, $UMUR: Int!, $ID: Int!) {
    insert_ANGGOTA_one(object: {NAMA: $NAMA, UMUR: $UMUR, JENIS_KELAMIN: $JENIS_KELAMIN, ID: $ID}) {
        ID
        NAMA
        UMUR
        JENIS_KELAMIN
        }
    }
    `;

const deletePengunjung = gql `mutation MyMutation($ID: Int!) {
    delete_ANGGOTA_by_pk(ID: $ID) {
        ID
        }
    }`;

const getByIdSubs = gql `
subscription MySubscription($_eq: Int!) {
    ANGGOTA(where: {ID: {_eq: $_eq}}) {
        ID
        JENIS_KELAMIN
        NAMA
        UMUR
        }
    }`;

const getByGenderSubs = gql `subscription MySubscription($_eq: String = "") {
    ANGGOTA(where: {JENIS_KELAMIN: {_eq: $_eq}}) {
        ID
        JENIS_KELAMIN
        NAMA
        UMUR
    }
    
}`;

const Home = () => {
    const [Id, setId] = useState(0);
    const [gender, setGender] = useState("");
    // const [byGender, {data: dataByGender, loading: loadingByGender}] = useLazyQuery(getByGender)
    const {data: dataByGender, loading: loadingByGender} = useSubscription(getByGenderSubs, {variables: {_eq: gender}});
    const [data, setData] = useState([])
    const { data: DataAnggota, loading, refetch } = useSubscription(getAllAnggotaSubs);
    // const [byId, {data: DatabyId, loading: loadingId}] = useLazyQuery(getById);
    const {data: DatabyId, loading: loadingId} = useSubscription(getByIdSubs, {variables: {_eq: Id}});
    const [insert, {loading: loadinginsert}] = useMutation(insertPengunjung, {refetchQueries: [getAllAnggota]});
    const [hapusAnggota, {data: deleteAnggota, loading: loadingdelete}] = useMutation(deletePengunjung, {refetchQueries: [getAllAnggotaSubs]});
    

    useEffect( () => {
        setData(DatabyId?.ANGGOTA);
    }, [DatabyId]) 

    useEffect( () => {
        setData(dataByGender?.ANGGOTA);
    }, [dataByGender]) 

    useEffect( () => {
        setData(DataAnggota?.ANGGOTA);
    }, [DataAnggota]) 

    const getDataAnggota = () => {
        setData(DataAnggota?.ANGGOTA);
    }

    // const getDatabyId = () => {
    //     byId({variables:{
    //         _eq: Id
    //     }});
        
    // }

    // const getDatabyGender = () => {
    //     byGender({variables:{
    //         _eq : gender
    //     }});
        
    // }

    // const onChangeAnggota = (e) => {
    //     if (e.target) {
    //         setData(e.target.value)
    //     }
    // };

    const onChangeId = (e) => {
        if (e.target) {
            setId(e.target.value)
        }
    };


    const onChangeGender = (e) => {
        if (e.target) {
            setGender(e.target.value)
        }
    };

    const hapusPengunjung = idx => {
        hapusAnggota({variables: {
            Id: idx,
        }});
        // setData(deleteAnggota?.ANGGOTA);
    };
    
    
    if (loading || loadingByGender || loadinginsert || loadingdelete || loadingId) {
        return "Loading ..."
    }

        return (
            <div>
                <Header/>
                <button onClick={getDataAnggota}> Show Data </button>
                <button onClick={getDataAnggota}> reset filter </button>
                <select onChange={onChangeGender} value={gender} >
                    <option value = {""} disabled>select</option>
                    <option value = {"LAKI - LAKI"}>LAKI - LAKI</option>
                    <option value = {"PEREMPUAN"}>PEREMPUAN</option>
                </select >
                {/* <button onClick={getDatabyGender}>enter</button> */}
                <input value={Id} onChange={onChangeId} value={Id} />
                {/* <button onClick={getDatabyId}>GET by ID</button> */}
                
                {loading?<p>Loading data</p> : <ListPassenger
                    data={data}
                    hapusPengunjung={hapusPengunjung}
                />}
                <PassengerInput 
                    insertPengunjung={insert}
                    refetch = {refetch}
                    />
                
                
            </div>
        )
    

}

export default Home;
