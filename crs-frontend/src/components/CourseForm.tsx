import { useState } from 'react'
import type { FormEvent } from 'react'
import { emptyCourseForm } from '../types/course'
import type { Course, CourseFormValues } from '../types/course'

interface CourseFormProps {
  editingCourse: Course | null
  onSubmit: (values: CourseFormValues) => Promise<void>
  onCancel: () => void
  submitting: boolean
  serverError: string | null
}

export default function CourseForm({ editingCourse, onSubmit, onCancel, submitting, serverError }: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(() => editingCourse ? {
    tenMonHoc: editingCourse.tenMonHoc,
    soTinChi: String(editingCourse.soTinChi),
    soChoToiDa: String(editingCourse.soChoToiDa),
  } : { ...emptyCourseForm })
  const [errors, setErrors] = useState<Partial<CourseFormValues>>({})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    const nextErrors: Partial<CourseFormValues> = {}
    if (!values.tenMonHoc.trim()) nextErrors.tenMonHoc = 'Tên môn học không được để trống.'
    if (!Number.isSafeInteger(Number(values.soTinChi)) || Number(values.soTinChi) <= 0) {
      nextErrors.soTinChi = 'Số tín chỉ phải là số nguyên lớn hơn 0.'
    }
    if (!Number.isSafeInteger(Number(values.soChoToiDa)) || Number(values.soChoToiDa) <= 0) {
      nextErrors.soChoToiDa = 'Số chỗ tối đa phải là số nguyên lớn hơn 0.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    await onSubmit(values)
  }

  return (
    <form className="course-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingCourse ? 'Sửa môn học' : 'Thêm môn học mới'}</h2>
      <fieldset disabled={submitting}>
        <div className="form-fields">
          <label>Tên môn học
            <input value={values.tenMonHoc} onChange={(event) => setValues({ ...values, tenMonHoc: event.target.value })}
              aria-invalid={!!errors.tenMonHoc} aria-describedby={errors.tenMonHoc ? 'name-error' : undefined} />
            {errors.tenMonHoc && <span className="error" id="name-error">{errors.tenMonHoc}</span>}
          </label>
          <label>Số tín chỉ
            <input type="number" min="1" step="1" value={values.soTinChi}
              onChange={(event) => setValues({ ...values, soTinChi: event.target.value })}
              aria-invalid={!!errors.soTinChi} aria-describedby={errors.soTinChi ? 'credits-error' : undefined} />
            {errors.soTinChi && <span className="error" id="credits-error">{errors.soTinChi}</span>}
          </label>
          <label>Số chỗ tối đa
            <input type="number" min="1" step="1" value={values.soChoToiDa}
              onChange={(event) => setValues({ ...values, soChoToiDa: event.target.value })}
              aria-invalid={!!errors.soChoToiDa} aria-describedby={errors.soChoToiDa ? 'capacity-error' : undefined} />
            {errors.soChoToiDa && <span className="error" id="capacity-error">{errors.soChoToiDa}</span>}
          </label>
        </div>
        {serverError && <p className="error" role="alert">{serverError}</p>}
        <div className="form-actions">
          <button className="primary" type="submit">{submitting ? 'Đang lưu...' : editingCourse ? 'Cập nhật' : 'Thêm mới'}</button>
          {editingCourse && <button type="button" onClick={onCancel}>Hủy</button>}
        </div>
      </fieldset>
    </form>
  )
}
