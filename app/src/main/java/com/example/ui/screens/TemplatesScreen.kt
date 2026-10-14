package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Template
import com.example.ui.StudioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TemplatesScreen(
    viewModel: StudioViewModel,
    onBack: () -> Unit,
    onNavigateToEditor: () -> Unit = {}
) {
    val templates by viewModel.templates.collectAsState()
    var selectedCategory by remember { mutableStateOf("All") }
    var selectedTemplateForPreview by remember { mutableStateOf<Template?>(null) }
    var showApplyDialog by remember { mutableStateOf(false) }
    var appliedTemplateName by remember { mutableStateOf("") }

    val categories = listOf("All", "Trending", "Instagram Reels", "Vlog", "Gaming", "Birthday", "Devotional", "Business")

    val filteredTemplates = if (selectedCategory == "All") {
        templates
    } else {
        templates.filter { it.category.equals(selectedCategory, ignoreCase = true) }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("CapCut Style Templates", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack, modifier = Modifier.testTag("back_button")) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.Search, contentDescription = "Search Templates")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Category Filter Bar
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(categories) { category ->
                    FilterChip(
                        selected = selectedCategory == category,
                        onClick = { selectedCategory = category },
                        label = { Text(category) }
                    )
                }
            }

            // Templates List
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(filteredTemplates) { template ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            // Header Row
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(template.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text("By ${template.author} • ${template.usageCount}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                                }
                                Badge(containerColor = MaterialTheme.colorScheme.primaryContainer) {
                                    Text(template.aspectRatio, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Preview Card Box
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.Black),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    IconButton(
                                        onClick = { selectedTemplateForPreview = template },
                                        modifier = Modifier
                                            .size(56.dp)
                                            .background(Color.White.copy(alpha = 0.3f), CircleShape)
                                    ) {
                                        Icon(Icons.Default.PlayArrow, contentDescription = "Preview", tint = Color.White, modifier = Modifier.size(32.dp))
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text("Tap to Preview (${template.duration}, ${template.clipsCount} clips)", color = Color.White, fontSize = 12.sp)
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Audio & Details Footer
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.MusicNote, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.primary)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(template.musicName, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                                }

                                Button(
                                    onClick = {
                                        appliedTemplateName = template.title
                                        showApplyDialog = true
                                    },
                                    modifier = Modifier.testTag("use_template_button_${template.id}"),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Use Template")
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Apply Template Dialog (Select Clips / Auto-Apply)
    if (showApplyDialog) {
        AlertDialog(
            onDismissRequest = { showApplyDialog = false },
            title = { Text("Apply '$appliedTemplateName'") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Select your video clips & photos to auto-sync with beats, transitions, and text animations:")
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedButton(onClick = { }, modifier = Modifier.fillMaxWidth()) {
                        Icon(Icons.Default.Add, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Select Clips from Gallery (3/3 selected)")
                    }
                    Text("✓ Beat Sync & Auto Transitions enabled\n✓ Text animations & Color grading ready", fontSize = 12.sp, color = Color(0xFF4CAF50))
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showApplyDialog = false
                        onNavigateToEditor()
                    }
                ) {
                    Text("Apply & Open Editor")
                }
            },
            dismissButton = {
                TextButton(onClick = { showApplyDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Preview Dialog
    selectedTemplateForPreview?.let { template ->
        AlertDialog(
            onDismissRequest = { selectedTemplateForPreview = null },
            title = { Text("Preview: ${template.title}") },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(240.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.Black),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.PlayCircle, contentDescription = null, tint = Color.White, modifier = Modifier.size(64.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Playing sample preview (${template.duration})", color = Color.White, fontSize = 12.sp)
                            Text("BGM: ${template.musicName}", color = Color.Gray, fontSize = 11.sp)
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val t = template.title
                        selectedTemplateForPreview = null
                        appliedTemplateName = t
                        showApplyDialog = true
                    }
                ) {
                    Text("Use This Template")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedTemplateForPreview = null }) {
                    Text("Close")
                }
            }
        )
    }
}
