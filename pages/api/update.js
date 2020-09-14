import Database from '../../globals/db'

export async function updateCourse (_id, id, value) {
  const db = Database()
  return await db.updateCourse(_id, 'data', value, id)
}

export async function reorder (_id, prev, final) {
  const db = Database()
  return await db.reorderCourse(_id, prev, final)
}

export default async (req, res) => {
  const data = req.body
  let success = null
  if (data.type === 'course') {
    success = await updateCourse(data._id, data.id, data.obj)
  } else if (data.type === 'reorder') {
    success = await reorder(data._id, data.old, data.new)
  }

  if (success) {
    res.status(200).json({ message: 'ok' })
  } else {
    res.status(500).json({ message: ':(' })
  }
}
