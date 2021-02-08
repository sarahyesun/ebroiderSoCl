import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import getDesigns from "app/designs/queries/getDesigns"

const ITEMS_PER_PAGE = 100

export const DesignsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ designs, hasMore }] = usePaginatedQuery(getDesigns, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {designs.map((design) => (
          <li key={design.id}>
            <Link href={`/designs/${design.id}`}>
              <a>{design.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const DesignsPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/designs/new">
          <a>Create Design</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <DesignsList />
      </Suspense>
    </div>
  )
}

DesignsPage.getLayout = (page) => <Layout title={"Designs"}>{page}</Layout>

export default DesignsPage
