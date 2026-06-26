import { Folder } from "@prisma/client";

export const buildTree = (folders: Folder[]) => {
    const map = new Map();

    folders.forEach((folder) => {
        map.set(folder.id, {
            ...folder,
            children: [],
        });
    });

    const roots: Folder[] = [];

    folders.forEach((folder) => {
        const node: Folder = map.get(folder.id);

        if (folder.folderId) {
            map.get(folder.folderId)?.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}