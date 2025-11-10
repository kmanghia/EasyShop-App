export class CategoryModel {
    id: number;
    category_name: string;
    description: string;
    image_url: string;
    children: CategoryModel[];
    parent: CategoryModel | undefined;
    count: number;

    constructor(
        id?: number,
        category_name?: string,
        description?: string,
        image_url?: string,
        children?: CategoryModel[],
        parent?: CategoryModel,
        count?: number
    ) {
        this.id = id ?? 0;
        this.category_name = category_name ?? '';
        this.description = description ?? '';
        this.image_url = image_url ?? '';
        this.children = children ?? [];
        this.parent = parent ?? undefined;
        this.count = count ?? 0;
    }

    convertObj(data: any) {
        const obj = new CategoryModel();
        obj.id = data?.id ?? 0;
        obj.category_name = data?.category_name ?? '';
        obj.description = data?.description ?? '';
        obj.image_url = data?.image_url ?? '';
        obj.children = data?.children?.map((child: any) => {
            const model = new CategoryModel();
            model.id = child?.id ?? 0;
            model.category_name = child?.category_name ?? '';
            return model;
        }) ?? [];
        obj.parent = data?.parent ? new CategoryModel().convertObj(data?.parent) : undefined;
        obj.count = data?.count ?? 0;

        return obj;
    }


}