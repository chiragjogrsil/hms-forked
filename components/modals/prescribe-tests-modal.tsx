"use client"

import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, Checkbox, Label, Badge } from "@/components/ui"

const PrescribeTestsModal = () => {
  const [show, setShow] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndividualTests, setSelectedIndividualTests] = useState([])
  const [viewMode, setViewMode] = useState("individual") // Declare viewMode
  const [form, setForm] = useState({ control: { value: [] } }) // Declare form
  const categories = ["all", "Category1", "Category2", "Category3"]
  const tests = [
    { value: "test1", label: "Test 1", category: "Category1", price: 100 },
    { value: "test2", label: "Test 2", category: "Category2", price: 200 },
    { value: "test3", label: "Test 3", category: "Category3", price: 300 },
    { value: "test4", label: "Test 4", category: "Category1", price: 150 },
  ]

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const filteredTests = selectedCategory === "all" ? tests : tests.filter((test) => test.category === selectedCategory)

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Prescribe tests
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Prescribe tests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {viewMode === "individual" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filter by Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Select Tests</Form.Label>
              {filteredTests.map((test) => {
                const isSelected = selectedIndividualTests.includes(test.value)

                return (
                  <FormField
                    key={test.value}
                    control={form.control}
                    name="selectedIndividualTests"
                    render={({ field }) => (
                      <div className="flex flex-row items-start space-x-3 space-y-0 p-3 hover:bg-accent rounded-md border">
                        <Checkbox
                          id={`test-${test.value}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, test.value]
                              : field.value.filter((value) => value !== test.value)
                            field.onChange(updatedValue)
                          }}
                        />
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`test-${test.value}`} className="cursor-pointer text-sm font-medium">
                            {test.label}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {test.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">₹{test.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                )
              })}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Prescribe tests
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PrescribeTestsModal
