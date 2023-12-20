import { db } from "@/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

export const fbAddTree = async (payload: TreeProps) => {
    try {
        const result = await addDoc(collection(db, 'trees'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding a tree: ${error}`);
    }
}

export const fbGetTrees = async () => {
    try {
        const result = await getDocs(collection(db, 'trees'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as TreeProps }));
        const trees = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return trees;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of trees: ${error}`);
    }
}

export const fbDeleteTree = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'trees', id));
        return 'Tree deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting an tree: ${error}`);
    }
}

export const fbUpdateTree = async (tree: TreeProps) => {
    try {
        console.log(tree);
        await updateDoc(doc(db, 'trees', tree.id!), { ...tree })
        return tree;
    } catch (error) {
        throw new Error(`An error occurred while updating a tree: ${error}`);
    }
}