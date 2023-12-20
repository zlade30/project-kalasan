import { db } from "@/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

export const fbAddArea = async (payload: AreaProps) => {
    try {
        const result = await addDoc(collection(db, 'areas'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding an area: ${error}`);
    }
}

export const fbGetAreas = async () => {
    try {
        const result = await getDocs(collection(db, 'areas'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as AreaProps }));
        const areas = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return areas;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of areas: ${error}`);
    }
}

export const fbDeleteArea = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'areas', id));
        return 'Area deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting an area: ${error}`);
    }
}

export const fbUpdateArea = async (area: AreaProps) => {
    try {
        await updateDoc(doc(db, 'areas', area.id!), { ...area })
        return area;
    } catch (error) {
        throw new Error(`An error occurred while updating an area: ${error}`);
    }
}