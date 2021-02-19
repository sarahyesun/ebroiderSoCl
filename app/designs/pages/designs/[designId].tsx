import {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {
	Link,
	useRouter,
	useQuery,
	useParam,
	BlitzPage,
	useMutation
} from 'blitz';
import getDesign from 'app/designs/queries/getDesign';
import deleteDesign from 'app/designs/mutations/deleteDesign';

export const Design = () => {
	const router = useRouter();
	const designId = useParam('designId', 'number');
	const [design] = useQuery(getDesign, {where: {id: designId}});
	const [deleteDesignMutation] = useMutation(deleteDesign);

	return (
		<div>
			<h1>Design {design.id}</h1>
			<pre>{JSON.stringify(design, null, 2)}</pre>

			<Link href={`/designs/${design.id}/edit`}>
				<a>Edit</a>
			</Link>

			<button
				type="button"
				onClick={async () => {
					if (window.confirm('This will be deleted')) {
						await deleteDesignMutation({where: {id: design.id}});
						await router.push('/designs');
					}
				}}
			>
        Delete
			</button>
		</div>
	);
};

const ShowDesignPage: BlitzPage = () => {
	return (
		<div>
			<p>
				<Link href="/designs">
					<a>Designs</a>
				</Link>
			</p>

			<Suspense fallback={<div>Loading...</div>}>
				<Design />
			</Suspense>
		</div>
	);
};

ShowDesignPage.getLayout = page => <Layout title={'Design'}>{page}</Layout>;

export default ShowDesignPage;
