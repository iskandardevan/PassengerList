import "./Home.css"
const ListItem = (props) => {

    const { ID, NAMA, UMUR, JENIS_KELAMIN } = props.data

    return (
        <tr>
            <td>{NAMA}</td>
            <td>{UMUR}</td>
            <td>{JENIS_KELAMIN}</td>
            <td className="removeBorder" onClick={() => props.hapusPengunjung(ID)}><button>Hapus</button></td>
        </tr>
    )
}

export default ListItem;