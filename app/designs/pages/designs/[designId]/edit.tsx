import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import getDesign from "app/designs/queries/getDesign"
import updateDesign from "app/designs/mutations/updateDesign"
import DesignForm from "app/designs/components/DesignForm"

export const EditDesign = () => {
  const router = useRouter()
  const designId = useParam("designId", "number")
  const [design, { setQueryData }] = useQuery(getDesign, { where: { id: designId } })
  const [updateDesignMutation] = useMutation(updateDesign)

  return (
    <div>
      <h1>Edit Design {design.id}</h1>
      <pre>{JSON.stringify(design)}</pre>

      <DesignForm
        initialValues={{
          name: design.name,
          description: design.description,
          isPublic: design.isPublic,
        }}
        onSubmit={async (data) => {
          try {
            const updated = await updateDesignMutation({
              where: { id: design.id },
              data,
            })
            await setQueryData(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push(`/designs/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error editing design " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
  )
}

const EditDesignPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditDesign />
      </Suspense>

      <p>
        <Link href="/designs">
          <a>Designs</a>
        </Link>
      </p>
    </div>
  )
}

EditDesignPage.getLayout = (page) => <Layout title={"Edit Design"}>{page}</Layout>

export default EditDesignPage
